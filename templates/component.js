class ###upperCaseName###Controller {

    constructor($log) {
        autoInjectServices(this, arguments); //used to Inject Dependencies
    }

    $onInit() {
        this.$log.log("###upperCaseName###()");
    }

}

app.component("###camelCaseName###", {
    templateUrl: "components/###kebabCaseName###/###kebabCaseName###.component.html",
    controller: ###upperCaseName###Controller,
    bindings: {}
});