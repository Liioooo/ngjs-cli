class ###upperCaseName###Service {

    constructor($log) {
        autoInjectServices(this, arguments); //used to Inject Dependencies

        $log.log("###upperCaseName###Service()");
    }

}

app.service("###camelCaseName###", ###upperCaseName###Service);