
let items = [
    { id: 1, name: "Book" },
    { id: 2, name: "Pen" },
    {id: 3, name: "Pencil"},
    {id: 4, name: "Ruler"},
    {id: 5, name: "Ikaramu"},
    {id: 6, name: "Akabati"},
    {id: 7, name: "Impapuro"}
];

app.get('/items', (req, res) => {
    res.json(items);
});

app.get('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const item = items.find(i => i.id === itemId);

    if (!item) {
        return res.status(404).json({ message: "Amakuru ushaka ntayari mububiko" });
    }
    res.json(item);
});

app.delete('/deleteitems/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    items = items.filter(i => i.id !== itemId);

    res.json({ message: "Item deleted successfully" });
});
app.post("/kongeraho", (req, res) => {
 const newItem = { id, name };
  items.push(newItem);
  res.status(201).json({
    message: "Item added successfully",
    data: newItem
  });
const { id, name } = req.body;
  if (!id || !name) {
    return res.status(400).json({
      message: "Both id and name are required"
    });
  }
  const exists = items.find(item => item.id === id);
  if (exists) {
    return res.status(409).json({
      message: "Item with this ID already exists"
    });
  }
});