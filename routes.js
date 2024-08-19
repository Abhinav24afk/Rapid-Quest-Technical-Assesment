app.get('/sales/total', async (req, res) => {
    const { interval } = req.query; // 'daily', 'monthly', 'quarterly', 'yearly'
    try {
        const data = await shopifyOrders.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: intervalMap[interval], date: "$created_at" }
                    },
                    totalSales: { $sum: "$total_price_set.shop_money.amount" }
                }
            }
        ]);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const intervalMap = {
    daily: "%Y-%m-%d",
    monthly: "%Y-%m",
    quarterly: "%Y-%Q",
    yearly: "%Y"
};
