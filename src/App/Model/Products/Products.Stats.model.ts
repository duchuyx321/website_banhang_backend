import { Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { IProductsStats } from '~/interfaces/ModelDatabase';

const ProductsStatsSchema: Schema = new Schema(
    {
        product_id: {
            type: Schema.Types.ObjectId,
            ref: 'Products',
            required: true,
        },
        total_views: { type: Number, default: 0 }, // lượt xem
        total_clicks: { type: Number, default: 0 }, // click vào detail
        total_add_to_cart: { type: Number, default: 0 }, // thêm vào giỏ
        total_orders: { type: Number, default: 0 }, // số đơn hàng
        total_sales: { type: Number, default: 0 }, // doanh thu (VND)
        total_wishlist: { type: Number, default: 0 }, // số lần yêu thích
        total_returns: { type: Number, default: 0 }, // số lần trả hàng (optional)
    },
    { timestamps: true, collection: 'productsStats' },
);

// plugin
ProductsStatsSchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});

const ProductsStats = model<IProductsStats>(
    'ProductsStats',
    ProductsStatsSchema,
);

export default ProductsStats;
