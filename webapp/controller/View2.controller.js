sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.demo.sapui5.controller.View2", {
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("RouteView2").attachPatternMatched(this.onPatternMatched, this);
        },
        onPatternMatched:function(oEvent){
            var empId = oEvent.getParameter("arguments").key;
            if(empId ==="newemp"){
                this.mode = "create";
                this.getView().unbindElement()
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
                if(mode === "create" || mode ==="edit"){
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
        }        
    });
});