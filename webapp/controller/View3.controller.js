sap.ui.define([
  "sap/ui/core/mvc/Controller"
], (BaseController) => {
  "use strict";

  return BaseController.extend("com.demo.sapui5.controller.View3", {
      onInit() {
      },
      //return to same page
      onNavBack:function(){
        history.go(-1)
      },
      //
      onChangeCharityType:function(){
        var chartType = this.getVuew().byId("idChartType").getSelectedKey()
        this.getView().byId("idVizFrame").setVizType(chartType)
      }
  });
});