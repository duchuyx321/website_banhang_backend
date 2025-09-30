import { Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { IProductsAIInsights } from '~/interfaces/ModelDatabase';

const ProductsAIInsightsSchema: Schema = new Schema(
    {
        product_id: {
            type: Schema.Types.ObjectId,
            ref: 'Products',
            required: true,
        },
        hot_score: { type: Number, default: 0 }, // điểm hot theo views, sold, search
        trend: {
            type: String,
            enum: ['rising', 'falling', 'stable'],
            default: 'stable',
        },
        forecast_sales_next_7d: { type: Number, default: 0 }, // dự báo doanh thu 7 ngày
        conversion_rate: { type: Number, default: 0 }, // tỉ lệ mua/view
    },
    { timestamps: true, collection: 'productsAIInsights' },
);

// plugin
ProductsAIInsightsSchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});

const ProductsAIInsights = model<IProductsAIInsights>(
    'ProductsAIInsights',
    ProductsAIInsightsSchema,
);

export default ProductsAIInsights;
