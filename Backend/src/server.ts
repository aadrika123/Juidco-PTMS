import app from "./app";

const PORT = process.env.PORT || 6001;

app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});
