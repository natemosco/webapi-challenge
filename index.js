require("dotenv").config();

const server = require("./server");

//reading an environment variable
const port = process.env.PORT || 3459;
server.listen(port, () => {
  console.log(
    `\n\t\t\t Welcome back Sir, server status is as follows:\n*** Server Running on http://localhost:${port} ***\n`
  );
});
