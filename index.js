const http = require("http");
const fs = require("fs");
const path = require("path");
const { URLSearchParams } = require("url");
const port = 8222;

// Paths to HTML files
const filePathplan = path.join(__dirname, "views", "plans.html");
const filePathlog = path.join(__dirname, "views", "login.html");
const filePathregi = path.join(__dirname, "views", "register.html");
const filePathser = path.join(__dirname, "views", "search.html");
const filePathcou = path.join(__dirname, "views", "courses.html");
const filePathhome = path.join(__dirname, "views", "home.html");
const filePathtop = path.join(__dirname, "views", "top.html");

// Path for JSON file
const filePathJSON = path.join(__dirname, "data", "registration-data.json");

// Create HTTP server
const api = http.createServer((req, res) => {
    if (req.url === "/" || req.url === "/home.html") {
        fs.readFile(filePathtop, "utf8", (err, topData) => {
            if (err) return handleError(res, err);
            fs.readFile(filePathhome, "utf8", (err, homeData) => {
                if (err) return handleError(res, err);
                const finalContent = topData + homeData;
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(finalContent);
            });
        });
    } else if (req.url === "/register" || req.url === "/register.html") {
        if (req.method === "GET") {
            fs.readFile(filePathtop, "utf8", (err, topData) => {
                if (err) return handleError(res, err);
                fs.readFile(filePathregi, "utf8", (err, regData) => {
                    if (err) return handleError(res, err);
                    const finalContent = topData + regData;
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(finalContent);
                });
            });
        } else if (req.method === "POST") {
            let body = '';
            req.on("data", chunk => {
                body += chunk.toString(); // Convert Buffer to string
            });

            req.on("end", () => {
                const newData = new URLSearchParams(body);
                const userData = {
                    fullname: newData.get("fullname"),
                    email: newData.get("email"),
                    password: newData.get("password"),
                };

                const dataDir = path.join(__dirname, "data");
                if (!fs.existsSync(dataDir)) {
                    fs.mkdirSync(dataDir);
                }

                fs.readFile(filePathJSON, "utf8", (err, data) => {
                    let jsonData = [];
                    if (!err && data.length > 0) {
                        jsonData = JSON.parse(data);
                    }
                    jsonData.push(userData);
                    fs.writeFile(filePathJSON, JSON.stringify(jsonData, null, 2), err => {
                        if (err) return handleError(res, err);
                        console.log('Registration data saved:', userData);
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.end("Registration data saved successfully");
                    });
                });
            });
        }
    } else if (req.url === "/login" || req.url === "/login.html") {
        if (req.method === "GET") {
            fs.readFile(filePathtop, "utf8", (err, topData) => {
                if (err) return handleError(res, err);
                fs.readFile(filePathlog, "utf8", (err, logData) => {
                    if (err) return handleError(res, err);
                    const finalContent = topData + logData;
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(finalContent);
                });
            });
        } else if (req.method === "POST") {
            let body = '';
            req.on("data", chunk => {
                body += chunk.toString(); // Convert Buffer to string
            });
    
            req.on("end", () => {
                const loginData = new URLSearchParams(body);
                const fullname = loginData.get("username");  // Correct the field name to match your login form (fullname is "username" in login page)
                const password = loginData.get("password");
    
                // Read the JSON file and validate login credentials
                fs.readFile(filePathJSON, "utf8", (err, data) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ success: false, message: "Internal server error" }));
                    }
    
                    let users = [];
                    if (data.length > 0) {
                        users = JSON.parse(data);
                    }
    
                    // Search for a user with the matching fullname and password in the stored data
                    const user = users.find(user => user.fullname === fullname && user.password === password);
    
                    if (user) {
                        // If match found, send success response
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: true }));
                    } else {
                        // If no match found, send failure response
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false }));
                    }
                });
            });
        }
    }
     else if (req.url === "/search" || req.url === "/search.html") {
        fs.readFile(filePathtop, "utf8", (err, topData) => {
            if (err) return handleError(res, err);
            fs.readFile(filePathser, "utf8", (err, serData) => {
                if (err) return handleError(res, err);
                const finalContent = topData + serData;
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(finalContent);
            });
        });
    } else if (req.url === "/course" || req.url === "/courses.html") {
        fs.readFile(filePathtop, "utf8", (err, topData) => {
            if (err) return handleError(res, err);
            fs.readFile(filePathcou, "utf8", (err, couData) => {
                if (err) return handleError(res, err);
                const finalContent = topData + couData;
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(finalContent);
            });
        });
    } else if (req.url === "/plans" || req.url === "/plans.html") {
        fs.readFile(filePathtop, "utf8", (err, topData) => {
            if (err) return handleError(res, err);
            fs.readFile(filePathplan, "utf8", (err, planData) => {
                if (err) return handleError(res, err);
                const finalContent = topData + planData;
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(finalContent);
            });
        });
    } else {
        // Default 404 response
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Page not found");
    }
});

// Error handling function
const handleError = (res, err) => {
    console.error(err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
};

// Start server
api.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
