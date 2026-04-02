sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.demo.sapui5.controller.View1", {
        onInit() {
        },
        onPress: function(){
            this.getOwnerComponent().getRouter().navTo("RouteView2")
        },
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
            onSubmit:function(){
                let empId = this.getView().byId("idEmpId").getValue()

                if(empId ===""){
                    this.getView().byId("idEmpId").setValueState("Error")
                    this.getView().byId("idEmpId").setValueStateText("Employee Id is Mandatory Please fill it")
                }else{
                    this.getView().byId("idEmpId").setValueState("None")
                }
            }
    });
});