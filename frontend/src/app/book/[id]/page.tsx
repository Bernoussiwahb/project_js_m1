"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CircularProgress, Typography, Container, Card, CardContent, Button } from "@mui/material";

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Fetch a single book by ID
const fetchBook = async (id: string) => {
  const { data } = await axios.get(`${API_URL}/books/${id}`);
  return data;
};

export default function BookDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: book, error, isLoading } = useQuery({
    queryKey: ["book", params.id],
    queryFn: () => fetchBook(params.id),
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Error loading book details.</Typography>;

  return (
    <Container sx={{ textAlign: "center", mt: 4, maxWidth: "600px" }}>
      <Typography variant="h3" sx={{ color: "#007FFF", fontWeight: "bold", mb: 3 }}>
        📖 Book Details
      </Typography>

      <Card sx={{ p: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>{book.title}</Typography>
          <Typography variant="body1">Published Year: {book.publishedYear}</Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold", color: "#388E3C" }}>Price: ${book.price}</Typography>

          {/* 📌 Clickable Link to Author Details */}
          <Typography variant="h6" sx={{ mt: 3 }}>👤 Author</Typography>
          {book.author ? (
            <Button
              variant="text"
              sx={{ textDecoration: "underline", color: "#007FFF" }}
              onClick={() => router.push(`/author/${book.author.id}`)} // ✅ Click to View Author Details
            >
              {book.author.name}
            </Button>
          ) : (
            <Typography variant="body2">Unknown Author</Typography>
          )}
        </CardContent>
      </Card>

      <Button
        variant="contained"
        sx={{ mt: 3, backgroundColor: "#1976D2", color: "white" }}
        onClick={() => router.push("/")}
      >
        ⬅ Back to Library
      </Button>
    </Container>
  );
}
