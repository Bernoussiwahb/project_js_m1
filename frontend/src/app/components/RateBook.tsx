import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button, TextField, Box } from "@mui/material";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function RateBook({ bookId }: { bookId: number }) {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const rateBookMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`${API_URL}/ratings`, {
        bookId,
        stars: Number(rating),
        comment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      setRating("");
      setComment("");
    },
  });

  return (
    <Box>
      <TextField
        label="Rating (0-5)"
        type="number"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        inputProps={{ min: 0, max: 5 }}
        fullWidth
      />
      <TextField
        label="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
        sx={{ mt: 1 }}
      />
      <Button
        onClick={() => rateBookMutation.mutate()}
        variant="contained"
        color="primary"
        sx={{ mt: 1 }}
      >
        Submit Rating
      </Button>
    </Box>
  );
}
