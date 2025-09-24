import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookie_parser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();
import connectDatabase from '~/Config/database/connectDB';
import router from '~/Router/index.route';

const app = express();
const port = process.env.PORT_SERVER;

// connect database
connectDatabase();

// bắt dữ liệu
app.use(morgan('combined'));
app.use(cookie_parser());

//  nhận dữ liệu
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// file tĩnh

// route
router(app);
// cros
app.use(cors());

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}/`);
});
