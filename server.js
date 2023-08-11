import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  let data = fs.readFileSync("task.json");
  const myObject = JSON.parse(data.toString());
  res.json(myObject);
});

app.post("/", (req, res) => {
  const tasks = req.body;

  let data = fs.readFileSync("task.json");
  const myObject = JSON.parse(data.toString());
  tasks.time = new Date().toLocaleTimeString();
  tasks.date = new Date().toLocaleDateString();
  myObject.push(tasks);
  const newData = JSON.stringify(myObject);
  fs.writeFile("task.json", newData, (err) => {
    if (err) throw err;
  });

  res.json({ out: newData });
});

app.delete("/", (req, res) => {
  const deletedTask = req.body;
  let data = fs.readFileSync("task.json");
  const myObject = JSON.parse(data.toString());
  const updatedObject = myObject.filter(
    (task) => task.task !== deletedTask.task
  );
  const newData = JSON.stringify(updatedObject);
  fs.writeFile("task.json", newData, (err) => {
    if (err) throw err;
  });

  res.json({ out: newData });
});

app.put("/", (req, res) => {
  const updatedTask = req.body.task;
  const updatedValue = req.body.edited;

  let data = fs.readFileSync("task.json");
  const myObject = JSON.parse(data.toString());
  const updatedIndex = myObject.findIndex((task) => task.task === updatedTask);

  if (updatedIndex !== -1) {
    myObject[updatedIndex].task = updatedValue;

    const newData = JSON.stringify(myObject);
    fs.writeFile("task.json", newData, (err) => {
      if (err) throw err;
    });

    res.json({ out: myObject }); // Return the entire updated list
  } else {
    res.json({ error: "Task not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
