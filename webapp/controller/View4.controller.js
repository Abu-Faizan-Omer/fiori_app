sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "com/demo/sapui5/model/formatter"
], (BaseController,formatter) => {
  "use strict";

  return BaseController.extend("com.demo.sapui5.controller.View4", {
      onInit() {
        var batchModel = this.getOwnerComponent().getModel("batchModel")
        batchModel.setData({
            aEmployees:[]
        })
      },
      //return to same page
      onNavBackView4:function(){
        history.go(-1)
      },
       //
      onChangeCharityType:function(){
        var chartType = this.getVuew().byId("idChartType").getSelectedKey()
        this.getView().byId("idVizFrame").setVizType(chartType)
      },
      onSelectFile:function(oEvent){
        //read the file and its content and convert that into a JSON array and bind that into a table
        var selFile = oEvent.getParameter("files")[0]
        this.readXLContentIntoJSONArray(selFile)
      },
      
      onSubmitBatchReq:function(){
        var aEmployees = this.getOwnerComponent().getModel("batchModel").getData().aEmployees
        var oModel = this.getOwnerComponent().getModel()

        var aDeferredGroups = oModel.getDeferredGroups()
        aDeferredGroups = aDeferredGroups.concat(["CreateGrp"])
        oModel.setDeferredGroups(aDeferredGroups)

        for(let i=0; i<aEmployees.length;i++){
             aEmployees[i].Doj = formatter.forDateForCreateNUpdate(aEmployees[i].Doj)
             aEmployees[i].Rating = parseInt(aEmployees[i].Rating)

            oModel.create("/EmployeeSet",aEmployees[i],{
                groupId: "CreateGrp" //bag name creategrp

            })
        }
        //sending bag to backend
        oModel.submitChanges({
            groupId: "CreateGrp",
            success:function(){

            },error:function(){

            }
        })
      },
      // convet excel data to JSON
      readXLContentIntoJSONArray:function(file){
        var that = this
        var aResults = []
        if(file && window.FileReader){
            var reader = new FileReader()
            reader.onload=function(e){
                var data = e.target.result
                var workbook = XLSX.read(data,{
                    type:'binary',
                    cellDates:true
                })
                workbook.SheetNames.forEach(function(sheetName){
                    // here is your object for every sheet in workbook
                    aResults = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName],{raw:false})
                })
                // edit below two line
                //convert data string to data object // add this code only when you have date field
                for(let i=0; i<aResults.length;i++){
                    aResults[i].Doj = new Date(aResults[i].Doj)
                }
                that.getOwnerComponent().getModel("batchModel").getData().aEmployees = aResults
                that.getOwnerComponent().getModel("batchModel").refresh(true)
            }
            reader.onerror = function(ex){
                console.log(ex)
            }
            reader.readAsArrayBuffer(file)
        }
      }
  });
});