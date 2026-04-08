sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/demo/sapui5/model/formatter",
     "sap/ui/model/Filter",
     "sap/ui/model/Sorter",
     "sap/ui/export/Spreadsheet"
], (Controller,formatter,Filter,Sorter,Spreadsheet) => {
    "use strict";

    return Controller.extend("com.demo.sapui5.controller.View1", {
        f:formatter,
        onInit() {
            this.getOwnerComponent().readEmployees();
        },
        onPress: function(){
            this.getOwnerComponent().getRouter().navTo("RouteView2")
        },
        // this is for key and display text 
          onSubmit2:function(){
            let selBoxVal = this.getView().byId("idSel").getSelectedKey()
            let cbVal = this.getView().byId("idCb").getSelectedKey()
            let mcbVal = this.getView().byId("idMcb").getSelectedKeys()  //why keys because it is multiplevalue
            let selIndex = this.getView().byId("idRbg").getSelectedIndex() //radio button give indexex
          },
          onSelFromSelectionBox:function(oEvent){
            var selBoxVal= this.getView().byId("idSel").getSelectedKey()
            //oEvent.getParameter("SelectedItem").getKey()
          },
          onSelFromCb:function(){
            let cbVal = this.getView().byId("idCb").getSelectedKey()
          },
          onSelFromMcb:function(){
             let mcbVal = this.getView().byId("idMcb").getSelectedKeys()
          },
          onSelFromRbg:function(){
            let selIndex = this.getView().byId("idRbg").getSelectedIndex()
          },
          getSelEmpData:function(){
            //this is for single selection 
            let empId = this.getView().byId("idTable").getSelectedItem().getBindingContext().getProperty("Empid")

            //mjultiple selection
            // let selBindingContext= this.getView().byId("idTable").getSelectedContexts()
            // for(let i=0;i<selBindingContext.length;i++){
            //     selBindingContext[i].getObject()
            // }
          },
          onPressRow:function(oEvent){
            var empid = oEvent.getSource().getBindingContext().getProperty("Empid")
          },
          onPressRowFromF4HelpTable:function(oEvent){
             this.empid = oEvent.getSource().getBindingContext().getProperty("Empid")
            this.getView().byId("idEmpId").setValue(this.empid)
            this.oDialog.close()
          },
          onPressValueHelp:function(){
            //load the fragment
            if(this.oDialog === undefined){
                this.oDialog = sap.ui.xmlfragment(this.getView().getId(),"com.demo.sapui5.view.EmpidF4Help",this)
                this.getView().addDependent(this.oDialog);
            }
            this.oDialog.open()
          },
          onCloseDialog:function(){
            this.oDialog.close()
          },
          onPressGo:function(){
            var aFilters = []
            var aSorters = []
            var empId = this.getView().byId("idEmpId").getValue()
            var name = this.getView().byId("idName").getValue()
            var design = this.getView().byId("idDesign").getSelectedKey()
            var skill = this.getView().byId("idSkill").getSelectedKey()
            var salOpr = this.getView().byId("idSalOpr").getSelectedKey()
            var salary = this.getView().byId("idSalary").getValue()
            var doj =  this.getView().byId("idDoj").getDateValue() //return date in object format
            doj=formatter.formatDateFilter(doj)

            if(empId!== ""){
              aFilters.push(new Filter ("Empid","EQ",empId))

            }
             if(name!== ""){
              aFilters.push(new Filter ("Name","EQ",name))

            }
            if(design!== ""){
              aFilters.push(new Filter ("Design","EQ",design))

            }
            if(skill!== ""){
              aFilters.push(new Filter ("Skill","EQ",skill))

            }
            if(salary!== ""){
              aFilters.push(new Filter ("Salary",salOpr,salary))

            }
            if(doj!== ""){
              aFilters.push(new Filter ("Doj",salOpr,doj))

            }
            this.getView().byId("idTable").getBinding("items").filter(aFilters)

            //Sort logic
            var sortField = this.getView().byId("idSortField").getSelectedKey()
            var sortOrder = this.getView().byId("idSortOrder").getSelectedIndex()


             if(sortField!== "" && sortOrder!==""){
               aSorters.push(new Sorter (sortField,(sortOrder === 0)? false:true))
            }
            this.getView().byId("idTable").getBinding("items").sort(aSorters)
          },
          onPressReset:function(){
            this.getView().byId("idEmpId").setValue("")
             this.getView().byId("idName").setValue("")
             this.getView().byId("idDesign").setSelectedKey("")
             this.getView().byId("idSkill").setSelectedKey("")
             this.getView().byId("idSalOpr").setSelectedKey("EQ")
             this.getView().byId("idSalary").setValue("")
             this.getView().byId("idDoj").setDateValue(null)
             this.getView().byId("idSortField").setSelectedKey("")
             this.getView().byId("idSortOrder").setSelectedIndex(-1);
            this.getView().byId("idTable").getBinding("items").filter([])
            this.getView().byId("idTable").getBinding("items").sort([])
          },
          onPressExportToXL:function(){
            var aCols,oRowBinding,oSettings,oSheet;
            oRowBinding = this.getView().byId('idTable').getBinding('items')
            //place your table columns and odata properties
            aCols = [{
                label:'Employee Id',
                property: 'Empid'
            },{
                label:'Name',
                property: 'Name'
            },{
                label:'Designation',
                property: 'Design'
            },{
                label:'Skill',
                property: 'Skill'
            },{
                label:'Email',
                property: 'Email'
            },{
                label:'Phone.No',
                property: 'Phone'
            },{
                label:'Status',
                property: 'Status'
            },{
                label:'Rating',
                property: 'Rating'
            },{
                label:'Date of Joining',
                property: 'Doj',
                type:'Date',
                format:'dd-MM-yyyy'
            },{
                label:'Salary',
                property: 'Salary',
                type:'Number',
                delimiter:true,
                scale:2
            }];
 
            oSettings={
                workbook:{
                    columns:aCols
                },
                dataSource: oRowBinding,
                fileName:'Employees.xlsx',
                worker:true
            };
            oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(function(){
                oSheet.destroy();
            })
 
        }


        //    this is for dynamic ui
        // onSubmit:function(){
        //     let name = this.getView().byId("idIpName").getValue()
        //     let msg = "Welcome To "+ name
        //     this.getView().byId("idTxtWelcome").setText(msg) 
            
        //     this.getView().byId("idBtnSubmit").setType("Accept")
        //     this.getView().byId("idTxtWelcome").setTextAlign("Left")
        //     this.getView().byId("idLblName").setRequired(false)
        //     this.getView().byId("idIpName").setEnabled(false)
        // }

        //      this is for mandatory validation
            // onSubmit2:function(){
            //     let empId = this.getView().byId("idEmpId").getValue()

            //     if(empId ===""){
            //         this.getView().byId("idEmpId").setValueState("Error")
            //         this.getView().byId("idEmpId").setValueStateText("Employee Id is Mandatory Please fill it")
            //     }else{
            //         this.getView().byId("idEmpId").setValueState("None")


            //         //data format validation here in else part 
                    
            //         // if(empId.length !== 10){
            //         //      this.getView().byId("idEmpId").setValueState("Error")
            //         //     this.getView().byId("idEmpId").setValueStateText("Employee Id Should be 10 Digits")
                        
            //         // }
            //         ///////// Alphabet validation

            //         let regExp = /^[a-zA-z]+$/;
            //         if(!empId.match(regExp)){
            //             this.getView().byId("idEmpId").setValueState("Error")
            //         this.getView().byId("idEmpId").setValueStateText("Employee Id Must be only Alphabet ")
            //         }




            //     }
            // }
    });
});