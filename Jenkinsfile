// Jenkinsfile mínimo — pegar en cada repo
// La shared library 'devsecops' debe estar registrada en
// Jenkins > Manage Jenkins > Global Pipeline Libraries

@Library('devsecops@main') _

devSecOpsPipeline([
    secretsEnabled : true,
    sastEnabled    : false,
    scaEnabled     : false,
    dastEnabled    : false,
])
