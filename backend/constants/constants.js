const credentials = {
  jsonKey: 'aRandomString',
  dynamicsTenantId:'30a23858-fd9e-4a4f-9f38-fea2ce722f9c',
  dynamicsHost:'org9b42e214.crm6.dynamics.com',
  dynamicsClientId:'66c9c188-d255-47be-9d18-b3a95af4c9b6',
  dynamicsUserName:'qavi@imamscouncil.onmicrosoft.com',
  dynamicsPassword:'Wuy57668'
}

const { 
        jsonKey, 
        dynamicsTenantId, 
        dynamicsHost, 
        dynamicsClientId, 
        dynamicsUserName, 
        dynamicsPassword } = credentials

module.exports = {
  jwtKey: `${jsonKey}`,
  dynamicsTenantId:`${dynamicsTenantId}`,
  dynamicsHost:`${dynamicsHost}`,
  dynamicsClientId:`${dynamicsClientId}`,
  dynamicsUserName:`${dynamicsUserName}`,
  dynamicsPassword:`${dynamicsPassword}`,
};