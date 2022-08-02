const { Sequelize } = require("sequelize");
const serilog = require("serilog");

const sequelize = new Sequelize("toughts", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

try {
  sequelize.authenticate();
  console.log("Conectado ao Banco de Dados...");
} catch (err) {
  // implementar serilog
  var log = serilog.configuration()
    .minimumLevel('WARNING')
    .filter(function (evt) { return !evt.properties.isNoisy; })
    .enrich({ username: identity.username })
    .writeTo(terminal())
    .writeTo(http({ url: 'http://my-app/logs' }))
    .createLogger();

  console.log(`Não foi possível conectar ${err}`);
};

module.exports = sequelize;
