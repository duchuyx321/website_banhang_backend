import { Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { ICategoriesStats } from '~/interfaces/ModelDatabase';

const CategoriesStatsSchema = new Schema(
    {
        category_id: {
            type: Schema.Types.ObjectId,
            ref: 'Categories',
            required: true,
        },
        total_products: { type: Number, default: 0 }, // Số lượng sản phẩm trong danh mục
        total_orders: { type: Number, default: 0 }, // Tổng số đơn hàng đã bán
        total_sales: { type: Number, default: 0 }, // Doanh thu (tiền)
        total_views: { type: Number, default: 0 }, // Tổng lượt xem sản phẩm
        total_searches: { type: Number, default: 0 }, // Tổng số lượt tìm kiếm liên quan
    },
    { timestamps: true, collection: 'categoriesStats' },
);

// plugin
CategoriesStatsSchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});

const CategoriesStats = model<ICategoriesStats>(
    'CategoriesStats',
    CategoriesStatsSchema,
);

export default CategoriesStats;
