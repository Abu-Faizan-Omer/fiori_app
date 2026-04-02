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
        onSubmit:function(){
            let name = this.getView().byId("idIpName").getValue()
            let msg = "Welcome To "+ name
            this.getView().byId("idTxtWelcome").setText(msg) 
            
            this.getView().byId("idBtnSubmit").setType("Accept")
            this.getView().byId("idTxtWelcome").setTextAlign("Left")
            this.getView().byId("idLblName").setRequired(false)
            this.getView().byId("idIpName").setEnabled(false)
        }
    });
});