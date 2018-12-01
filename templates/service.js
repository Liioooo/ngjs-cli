class ###upperCaseName###Service {

    constructor($log) {
        this.autoInjectServices(arguments); //used to Inject Dependencies

        $log.log("###upperCaseName###Service()");
    }

}

app.service("###camelCaseName###", ###upperCaseName###Service);