const formatCardResponse = (card) => ({
    _id: card._id,   //  Ensure `_id` comes first
    title: card.title,
    subtitle: card.subtitle,
    description: card.description,
    phone: card.phone,
    email: card.email,
    web: card.web,
    bizNumber: card.bizNumber,
    likes: card.likes || [],
    user_id: card.user_id,
    createdAt: card.createdAt,
    __v: card.__v,

    //  Move `image` and `address` to the bottom
    address: {
        _id: card.address?._id,
        state: card.address?.state || "",
        country: card.address?.country || "",
        city: card.address?.city || "",
        street: card.address?.street || "",
        houseNumber: card.address?.houseNumber || 0,
        zip: card.address?.zip || 0
    },
    image: {
        _id: card.image?._id,
        url: card.image?.url || "",
        alt: card.image?.alt || ""
    }
});

export { formatCardResponse };
