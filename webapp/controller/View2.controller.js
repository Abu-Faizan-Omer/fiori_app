sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/demo/sapui5/model/formatter",
    "sap/m/MessageBox"
], (Controller,formatter,MessageBox) => {
    "use strict";

    return Controller.extend("com.demo.sapui5.controller.View2", {
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("RouteView2").attachPatternMatched(this.onPatternMatched, this);
        },
        onPatternMatched:function(oEvent){
            var empId = oEvent.getParameter("arguments").key;
            if(empId ==="newemp"){
                this.mode = "create";
                //this.getView().unbindElement()
                this.handleBtnVisibility(this.mode)

            }else{
                this.mode = "display";
                this.handleBtnVisibility(this.mode)
                this.getView().bindElement("/EmployeeSet('"+ empId + "')")

            }
            this.loadFragment(this.mode)
            
    
            },
            loadFragment:function(mode){
                this.getView().byId("idPanel").removeAllContent()
                if( mode ==="edit"){
                    if(!this.editfrag){
                        this.editfrag= sap.ui.xmlfragment(this.getView().getId(),"com.demo.sapui5.view.EmpEdit",this)
                    }
                    this.getView().byId("idPanel").addContent(this.editfrag)
                   
                }else if(mode === "display"){
                    if(!this.displayfrag){
                        this.displayfrag= sap.ui.xmlfragment(this.getView().getId(),"com.demo.sapui5.view.EmpDisplay",this)
                    }
                    this.getView().byId("idPanel").addContent(this.displayfrag)
                }
                else if(mode === "create"){
                    if(!this.createfrag){
                        this.createfrag= sap.ui.xmlfragment(this.getView().getId(),"com.demo.sapui5.view.EmpCreate",this)
                    }
                    this.getView().byId("idPanel").addContent(this.createfrag)
                }
        },
        handleBtnVisibility:function(mode){
            this.getView().byId("idBtnEdit").setVisible(false)
            this.getView().byId("idBtnDisplay").setVisible(false)
            this.getView().byId("idBtnSave").setVisible(false)
            this.getView().byId("idBtnCancel").setVisible(false)
            this.getView().byId("idBtnDelete").setVisible(false)

            if(mode === "create"){
                this.getView().byId("idBtnSave").setVisible(true)
            this.getView().byId("idBtnCancel").setVisible(true)
            }
            else if(mode === "display"){
                this.getView().byId("idBtnEdit").setVisible(true)
                 this.getView().byId("idBtnDelete").setVisible(true)
            }
        },
        onPressSave:function(){
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
                Empid:empId,
                Name:name,
                Design:design,
                Skill:skill,
                Email:email,
                Phone:phone,
                Salary:salary,
                Doj:doj,
                Status:status,
                Rating:rating
            }

            var oModel = this.getOwnerComponent().getModel()
            oModel.create("/EmployeeSet",data,{
                success:function(){
                    MessageBox.success("New Employee Created Successfully")
                },
                error:function(oError){
                    MessageBox.error(JSON.parse(oError.responseText).error.message.value)
                }
            })

        }        
    });
});