sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/demo/sapui5/model/formatter",
    "sap/m/MessageBox",
    "sap/ui/unified/FileUploaderParameter"
], (Controller, formatter, MessageBox , FileUploaderParameter) => {
    "use strict";

    return Controller.extend("com.demo.sapui5.controller.View2", {
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("RouteView2").attachPatternMatched(this.onPatternMatched, this);
            //pulling the prjModel
            this.prjModel = this.getOwnerComponent().getModel("prjModel")
            this.prjModel.setData({
                aProjects : [

                    //this will add empty input so we need to push
                    // {
                    //     Empid:"",
                    //     Prjcode:"",
                    //     Clientname:"",
                    //     Prjname: "",
                    //     Prjdesc:"",
                    //     Teamsize:0
                    // }
                ]
            })

            //for edit 
             this.editPrjModel = this.getOwnerComponent().getModel("editPrjModel")
            
        },


        onPressAddRowForEdit:function(){
            this.editPrjModel.getData().results.push( {
                        Empid:"",
                        Prjcode:"",
                        Clientname:"",
                        Prjname: "",
                        Prjdesc:"",
                        Teamsize:0
                    })
                    //it has to be refersh after push so that new item is visible
                    this.editPrjModel.refresh(true)

        },

        onPressDeleteRowForEdit:function(oEvent){
            var Index= oEvent.getSource().getParent().getBindingContextPath().split("/")[2]
            this.editPrjModel.getData().results.splice(Index,1)
            this.editPrjModel.refresh(true)
        },
        //this will add new field in the project creation

        onPressAddRow:function(){
            this.prjModel.getData().aProjects.push( {
                        Empid:"",
                        Prjcode:"",
                        Clientname:"",
                        Prjname: "",
                        Prjdesc:"",
                        Teamsize:0
                    })
                    //it has to be refersh after push so that new item is visible
                    this.prjModel.refresh(true)

        },
        //delete that particular input for project assign
        onPressDeleteRow:function(oEvent){
            var Index= oEvent.getSource().getParent().getBindingContextPath().split("/")[2]
            this.prjModel.getData().aProjects.splice(Index,1)
            this.prjModel.refresh(true)
        },

        
        onPatternMatched: function (oEvent) {
            var empId = oEvent.getParameter("arguments").key;
            if (empId === "newemp") {
                this.mode = "create";
                //this.getView().unbindElement()
                this.handleBtnVisibility(this.mode)

            } else {
                this.mode = "display";
                this.handleBtnVisibility(this.mode)
                this.getView().bindElement("/EmployeeSet('" + empId + "')")

            }
            this.loadFragment(this.mode)


        },
        loadFragment: function (mode) {
            this.getView().byId("idPanel").removeAllContent()
            if (mode === "edit") {
                if (!this.editfrag) {
                    this.editfrag = sap.ui.xmlfragment(this.getView().getId(), "com.demo.sapui5.view.EmpEdit", this)
                }
                this.getView().byId("idPanel").addContent(this.editfrag)

            } else if (mode === "display") {
                if (!this.displayfrag) {
                    this.displayfrag = sap.ui.xmlfragment(this.getView().getId(), "com.demo.sapui5.view.EmpDisplay", this)
                }
                this.getView().byId("idPanel").addContent(this.displayfrag)
            }
            else if (mode === "create") {
                if (!this.createfrag) {
                    this.createfrag = sap.ui.xmlfragment(this.getView().getId(), "com.demo.sapui5.view.EmpCreate", this)
                }
                this.getView().byId("idPanel").addContent(this.createfrag)
            }
        },
        handleBtnVisibility: function (mode) {
            this.getView().byId("idBtnEdit").setVisible(false)
            this.getView().byId("idBtnDisplay").setVisible(false)
            this.getView().byId("idBtnSave").setVisible(false)
            this.getView().byId("idBtnCancel").setVisible(false)
            this.getView().byId("idBtnDelete").setVisible(false)

            if (mode === "create") {
                this.getView().byId("idBtnSave").setVisible(true)
                this.getView().byId("idBtnCancel").setVisible(true)
            }
            else if (mode === "display") {
                this.getView().byId("idBtnEdit").setVisible(true)
                this.getView().byId("idBtnDelete").setVisible(true)
            } else if (mode === "edit") {
                this.getView().byId("idBtnSave").setVisible(true)
                this.getView().byId("idBtnCancel").setVisible(true)
            }
        },
        ///when cancel the button two scenario either create/edit
        onPressCancel: function () {
            if (this.mode === "create") {
                //when we are in create mode  return to first page

            } else if (this.mode === "edit") {
                //now we are in edit mode
                this.mode = "display"
                this.loadFragment(this.mode)
                this.handleBtnVisibility(this.mode)
            }



        },//this is for edi, read project of each while editing
        readProjectsOfEmp:function(){
            var empId = this.getView().getBindingContext().getProperty("Empid")
            var oModel = this.getOwnerComponent().getModel()
            oModel.read("/EmployeeSet('"+empId+"')/toProjects",{
                success:function(data){
                    this.editPrjModel.setData(data)
                }.bind(this),error:function(oError){
                    MessageBox.error("Unable to fetch the Project Information")
                }
            })
        },

        //on press edit button it will disappear and save and cancel button icon is visible
        onPressEdit: function () {
            this.readProjectsOfEmp()
            this.mode = "edit"
            this.loadFragment(this.mode)
            this.handleBtnVisibility(this.mode)

        },


        onPressSave: function () {
            if (this.mode === "create") {
                var empId = this.getView().byId("idEmpId2").getValue()
                var name = this.getView().byId("idName2").getValue()
                var design = this.getView().byId("idDesign2").getValue()
                var skill = this.getView().byId("idSkill2").getValue()
                var email = this.getView().byId("idEmail2").getValue()
                var phone = this.getView().byId("idPhone2").getValue()
                var salary = this.getView().byId("idSalary2").getValue()
                var doj = this.getView().byId("idDoj2").getDateValue()
                doj = formatter.forDateForCreateNUpdate(doj)

                var status = this.getView().byId("idStatus2").getValue()
                var rating = this.getView().byId("idRating2").getValue()

                var data = {
                    Empid: empId,
                    Name: name,
                    Design: design,
                    Skill: skill,
                    Email: email,
                    Phone: phone,
                    Salary: salary,
                    Doj: doj,
                    Status: status,
                    Rating: rating,
                    //we are sending data to backend
                    toProjects:this.prjModel.getData().aProjects
                }

                var oModel = this.getOwnerComponent().getModel()
                oModel.create("/EmployeeSet", data, {
                    success: function (req,res) {
                        MessageBox.success("New Employee Created Successfully")
                    },
                    error: function (oError) {
                        MessageBox.error(JSON.parse(oError.responseText).error.message.value)
                    }
                })
            }
            else if (this.mode === "edit") {
                var empId = this.getView().byId("idEmpId1").getValue()
                var name = this.getView().byId("idName1").getValue()
                var design = this.getView().byId("idDesign1").getValue()
                var skill = this.getView().byId("idSkill1").getValue()
                var email = this.getView().byId("idEmail1").getValue()
                var phone = this.getView().byId("idPhone1").getValue()
                var salary = this.getView().byId("idSalary1").getValue()
                var doj = this.getView().byId("idDoj1").getDateValue()
                doj = formatter.forDateForCreateNUpdate(doj)

                var status = this.getView().byId("idStatus1").getValue()
                var rating = this.getView().byId("idRating1").getValue()

                var data = {
                    Empid: empId,
                    Name: name,
                    Design: design,
                    Skill: skill,
                    Email: email,
                    Phone: phone,
                    Salary: salary,
                    Doj: doj,
                    Status: status,
                    Rating: rating,
                    //we are sending data to backend
                    toProjects:this.editPrjModel.getData().results
                }

                var oModel = this.getOwnerComponent().getModel()
                oModel.create("/EmployeeSet", data, {
                    success: function (res) {
                        MessageBox.success("Employee Updated Successfully")
                    },
                    error: function (oError) {
                        MessageBox.error(JSON.parse(oError.responseText).error.message.value)
                    }
                })
            }
        },
            //this is for delete the record and redirect to first page
            onPressDelete:function(){
                var empId = this.getView().getBindingContext().getProperty("Empid")
                var oModel = this.getOwnerComponent().getModel()

                oModel.remove("/EmployeeSet('" + empId + "')",  {
                    success: function (res) {
                        MessageBox.success("Employee Deleted Successfully")
                        this.getOwnerComponent().getRouter().navTo("RouteView1")
                    },
                    error: function (oError) {
                        MessageBox.error(JSON.parse(oError.responseText).error.message.value)
                    }
                })
            },
            // this is for file upload
            onChangeFile:function(oEvent){
                this.fileName = oEvent.getParameter("files")[0].name
                this.fileType = oEvent.getParameter("files")[0].type
            },
            onUploadPhoto:function(){
                var oFileUploader = this.getView().byId("idFileUploader1")
                var empId = this.getView().byId("idEmpId1").getValue()
                var slug = empId + ","+ this.fileName

                //step 1 add slug parameter
                oFileUploader.addHeaderParameter(new FileUploaderParameter({
                    name:"slug",
                    value:slug
                }))

                //step 2 add the filetype parameter
                oFileUploader.addHeaderParameter(new FileUploaderParameter({
                    name:"Content-Type",
                    value:this.fileType
                }))

                //step 3 add CSRF Token
                this.getOwnerComponent().getModel().refreshSecurityToken()
                oFileUploader.addHeaderParameter(new FileUploaderParameter({
                    name:"x-csrf-token",
                    value:this.getOwnerComponent().getModel().getHeaders()['x-csrf-token']
                }))
                oFileUploader.upload()
            },
            onPhotoUploadComplete:function(oEvent){
                var status = oEvent.getParameter("status")
                if(status === 201 || status === 202 || status === 204){
                    MessageBox.success("Your Profile Picture Upload Successfully")
                }else{
                    MessageBox.error("File Upload Failed, Please check internet connectivity and try again")
                }
            },
            // phoyo download when click
            onPressPhoto:function(){
                var empId = this.getView().getBindingContext().getProperty("Empid")
                var url = "/sap/opu/odata/sap/ZB70_EMP_SRV/PhotoSet('"+empId+"')/$value"
                sap.m.URLHelper.redirect(url,false)
            },
            //
            onPressDownload:function(oEvent){
                var empId = oEvent.getSource().getParent().getBindingContext().getProperty("Empid")
                var fileName = oEvent.getSource().getParent().getBindingContext().getProperty("Filename")
                 var url = "/sap/opu/odata/sap/ZB70_EMP_SRV/ResumeSet(Empid='"+empId+"',Filename= '"+fileName+"')/$value"
                sap.m.URLHelper.redirect(url,false)
            },
            //   Resume upload code
            onUploadResumes:function(){
                 var oUploadSet = this.getView().byId("idUploadSet")
                var empId = this.getView().byId("idEmpId1").getValue()
                var aIncompleteItems = oUploadSet.getIncompleteItems()
                
                for(let i=0;i<aIncompleteItems.length;i++){
                    var slug = empId + "," + aIncompleteItems[i].getFileName()

                    // step 1 construct slug
                    var oSlug = new sap.ui.core.item({
                        key:"SLUG",
                        text:slug
                    })
                    oUploadSet.addHeaderField(oSlug)

                     //step 2 add CSRF Token
                     this.getOwnerComponent().getModel().refreshSecurityToken()
                     var oXCSRFToken = new sap.ui.core.Item({
                        key:"X-CSRF-Token",
                        text: this.getOwnerComponent().getModel().getSecurityToken()
                     })
                     oUploadSet.addHeaderField(oXCSRFToken)

                     //now send to backend
                     oUploadSet.uploadItem(aIncompleteItems[i])

                     oUploadSet.removeAllHeaderFields()
                }
            },
            onResumesUploadCompleted:function(oEvent){
                 var status = oEvent.getParameter("status")
                if(status === 201 || status === 202 || status === 204){
                    MessageBox.success("Your Resume Uploaded Successfully")
                }else{
                    MessageBox.error("File Upload Failed, Please check internet connectivity and try again")
                }
            }


    });
});