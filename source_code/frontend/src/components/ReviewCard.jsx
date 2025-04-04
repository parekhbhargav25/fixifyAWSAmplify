import React from "react";
import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const ReviewCard = ({ review }) => {
  console.log('Review:', review);
  console.log('Rating:', review.rating, typeof review.rating);
  
  return (
    <Card sx={{ maxWidth: 350, m: 2, p: 2, borderRadius: 3, boxShadow: 5 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ width: 56, height: 56 }} />
          <Typography variant="h6" fontWeight="bold">
            {review.customerName}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" mt={1} gap={0.5}>
          {Array(review.rating)
            .fill()
            .map((_, i) => (
              <StarIcon key={i} sx={{ color: "#FFD700" }} />
            ))}
        </Box>

        <Typography variant="body1" color="text.secondary" mt={1}>
          "{review.description}"
        </Typography>
      </CardContent>
    </Card>
  );
};


export default ReviewCard;