sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/demo/sapui5/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("com.demo.sapui5.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

            this.readEmployees();
            
        },
        readEmployees:function(){
            //get odata model object

            var oModel = this.getModel();//check who is empty model nama
            var empModel = this.getModel("empModel");//json data give model
            oModel.read("/EmployeeSet",{    //pull data from this 
                success:function(data){

                    for (let i=0;i<data.results.length;i++){
                        data.results[i].SNo = i+1
                        data.results[i].Name= "Mr " + data.results[i].Name 
                    }
                    empModel.setData(data)
                },
                error:function(){

                }  
            })
        }
    });
});