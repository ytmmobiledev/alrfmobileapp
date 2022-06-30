const {ConnectionBuilder} = require("electron-cgi");

test()

async function test() {
    try {
        let connection = new ConnectionBuilder()
            .connectTo("dotnet", "run", "--project", "DotNetLocation")
            .build();

        connection.onDisconnect = () => {console.warn("finish-location")};


        const response = await connection.send("greeting","")

        try {
            console.log(response.toString().split("-"))
        }catch (e) {

        }


        connection.close();
    }catch{}


}