const app = require('./app2');
const PORT = 4000;


//connect express server
app.listen(PORT, ()=>{
    console.log(`Server is open at http://localhost:${PORT}`);
});