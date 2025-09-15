import { Document, Schema } from 'mongoose';

// user mongodb
export interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    username: string;
    email: string;
    password: string;
    avatar?: {
        image_url: string | null;
        public_id: string | null;
    };
    first_name: string;
    role: string | 'User';
    last_name: string;
    isBlock: boolean | false;
    isDeleted: boolean | false;
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    deletedAt?: Date;
    deletedBy?: Schema.Types.ObjectId;
}
// product mongodb
export interface IProducts extends Document {
    _id: Schema.Types.ObjectId;
    category_id: Schema.Types.ObjectId;
    name: string;
    description: string;
    mainImage: number;
    thumbnail: {
        image_url: string;
        public_id: string;
    }[];
    brand: string;
    isDeleted: boolean | null;
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    deletedAt?: Date;
    deletedBy?: Schema.Types.ObjectId;
}

//  Categories mongodb
export interface ICategories extends Document {
    _id: Schema.Types.ObjectId;
    name: string;
    description: string;
    thumbnail: {
        image_url: string;
        public_id: string;
    };
    parent_id: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    deletedAt?: Date;
    deletedBy?: Schema.Types.ObjectId;
}
// CategoriesStats mongodb
export interface ICategoriesStats extends Document {
    category_id: Schema.Types.ObjectId;
    total_products: number; // Số lượng sản phẩm trong danh mục
    total_orders: number; // Tổng số đơn hàng đã bán
    total_sales: number; // Doanh thu (tiền)
    total_views: number; // Tổng lượt xem sản phẩm
    total_searches: number; // Tổng số lượt tìm kiếm liên quan
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    deletedAt?: Date;
    deletedBy?: Schema.Types.ObjectId;
}
// CategoriesAIInsights mongodb
export interface ICategoriesAIInsights extends Document {
    category_id: Schema.Types.ObjectId; // Liên kết tới Categories
    hot_score: number; // Điểm "nóng" do AI tính
    trend: string | 'stable'; // Xu hướng
    forecast_sales_next_7d: number; // Dự báo doanh thu 7 ngày tới
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    deletedAt?: Date;
    deletedBy?: Schema.Types.ObjectId;
}
// Variants mongodb
export interface IVariants extends Document {
    _id: Schema.Types.ObjectId;
    variantable_color: string;
    variantable_size: string;
    price: number;
    product_id: Schema.Types.ObjectId;
    SKU: string;
    variantable_weight: string;
    variantable_unit: string; // đơn vị tính của trong lương
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    deletedAt?: Date;
    deletedBy?: Schema.Types.ObjectId;
}

// Inventories mongodb
export interface IInventories extends Document {
    _id: Schema.Types.ObjectId;
    variant_id: Schema.Types.ObjectId;
    stock: number;
    sold: number;
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    deletedAt?: Date;
    deletedBy?: Schema.Types.ObjectId;
}
// Products Stats mongodb
export interface IProductsStats extends Document {
    product_id: Schema.Types.ObjectId;
    total_views: number; // lượt xem
    total_clicks: number; // click vào detail
    total_add_to_cart: number; // thêm vào giỏ
    total_orders: number; // số đơn hàng
    total_sales: number; // doanh thu (VND)
    total_wishlist: number; // số lần yêu thích
    total_returns: number; // số lần trả hàng (optional)
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    deletedAt?: Date;
    deletedBy?: Schema.Types.ObjectId;
}
// Products AIInsights mongodb
export interface IProductsAIInsights extends Document {
    product_id: Schema.Types.ObjectId;
    hot_score: number; // điểm hot theo views, sold, search
    trend: string;
    forecast_sales_next_7d: number; // dự báo doanh thu 7 ngày
    conversion_rate: number; // tỉ lệ mua/view
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    deletedAt?: Date;
    deletedBy?: Schema.Types.ObjectId;
}

// Payments mongodb
export interface IPayments extends Document {
    _id: Schema.Types.ObjectId;
    order_id: Schema.Types.ObjectId;
    user_id: Schema.Types.ObjectId;
    amount: string;
    status: string;
    currency: string;
    method: string;
    transactionid: string;
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    deletedAt?: Date;
    deletedBy?: Schema.Types.ObjectId;
}

// ShippingProviders mongodb
export interface IShippingProviders extends Document {
    _id: Schema.Types.ObjectId;
    order_id: Schema.Types.ObjectId;
    name: string;
    code: string;
    hotline: string;
    website: string;
    is_active: string;
    avatar: {
        image_url: string;
        public_id: string;
    } | null;
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    deletedAt?: Date;
    deletedBy?: Schema.Types.ObjectId;
}

// Order mongodb
export interface IOrders extends Document {
    _id: Schema.Types.ObjectId;
    User_ID: Schema.Types.ObjectId;
    Orderable_items: Schema.Types.ObjectId[];
    Address_ID: Schema.Types.ObjectId;
    Orderable_status: Schema.Types.ObjectId;
    PaymentMethod: string;
    TotalAmount: number;
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    deletedAt?: Date;
    deletedBy?: Schema.Types.ObjectId;
}

// OrderStatus mongodb
export interface IOrderStatus extends Document {
    _id: Schema.Types.ObjectId;
    code: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    deletedAt?: Date;
    deletedBy?: Schema.Types.ObjectId;
}

// ShippingPolicies mongodb
export interface IShippingPolicies extends Document {
    _id: Schema.Types.ObjectId;
    provider_id: Schema.Types.ObjectId;
    region: string;
    unit: string;
    base_fee: number;
    base_weight: number;
    max_weight: number;
    fee_per_unit: number;
    estimated_days: number;
    is_active: boolean;
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    deletedAt?: Date;
    deletedBy?: Schema.Types.ObjectId;
}

//OrderItems mongodb
export interface IOrderItems extends Document {
    _id: Schema.Types.ObjectId;
    user_id: Schema.Types.ObjectId;
    product_id: Schema.Types.ObjectId;
    quantity: number;
    price: number;
    discount: number;
    total: number;
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    deletedAt?: Date;
    deletedBy?: Schema.Types.ObjectId;
}

//Carts mongodb
export interface ICarts extends Document {
    _id: Schema.Types.ObjectId;
    cartable_items: Schema.Types.ObjectId[] | null;
    user_id: Schema.Types.ObjectId;
    totalquantity: number | null;
    totalprice: number | null;
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    deletedAt?: Date;
    deletedBy?: Schema.Types.ObjectId;
}

//CartItems mongodb
export interface ICartItems extends Document {
    _id: Schema.Types.ObjectId;
    cart_id: Schema.Types.ObjectId;
    user_id: Schema.Types.ObjectId;
    variant_id: Schema.Types.ObjectId;
    quantity: number;
    subtotal: number;
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    deletedAt?: Date;
    deletedBy?: Schema.Types.ObjectId;
}

//Address mongodb
export interface IAddress extends Document {
    _id: Schema.Types.ObjectId;
    phone: string;
    addressable_line: string;
    addressable_ward: string;
    addressable_city: string;
    country: string;
    addressable_district: string;
    fullname: string;
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    deletedAt?: Date;
    deletedBy?: Schema.Types.ObjectId;
}
