import { Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { ICategoriesAIInsights } from '~/interfaces/ModelDatabase';

const CategoriesAIInsightsSchema = new Schema(
    {
        category_id: {
            type: Schema.Types.ObjectId,
            ref: 'Categories',
            required: true,
        }, // Liên kết tới Categories
        hot_score: { type: Number, default: 0 }, // Điểm "nóng" do AI tính
        trend: {
            type: String,
            enum: ['rising', 'falling', 'stable'], // tăng, giảm, ổn định
            default: 'stable',
        }, // Xu hướng
        forecast_sales_next_7d: { type: Number, default: 0 }, // Dự báo doanh thu 7 ngày tới
    },
    { timestamps: true, collection: 'categoriesAIInsights' },
);
// plugin
CategoriesAIInsightsSchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});

const CategoriesAIInsights = model<ICategoriesAIInsights>(
    'CategoriesAIInsights',
    CategoriesAIInsightsSchema,
);

export default CategoriesAIInsights;
