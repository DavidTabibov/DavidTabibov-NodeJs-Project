export const formatCardResponse = (card) => ({
    _id: card._id,
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

// Validation function for updating card fields
export const validateUpdate = (data) => {
    const allowedFields = {};
    if (data.title) allowedFields.title = data.title;
    if (data.subtitle) allowedFields.subtitle = data.subtitle;
    if (data.description) allowedFields.description = data.description;
    if (data.phone) allowedFields.phone = data.phone;
    if (data.email) allowedFields.email = data.email;
    if (data.web) allowedFields.web = data.web;
    return { error: null, allowedFields };
};
