import app from './app.js';

const port = parseInt(process.env.PORT || '3000', 10);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
