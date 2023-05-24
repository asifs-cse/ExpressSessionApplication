const app = require('./app');
const PORT = 4000;

app.listen(PORT, ()=>{
    console.log(`Server is open at http://localhost:${PORT}`);
});