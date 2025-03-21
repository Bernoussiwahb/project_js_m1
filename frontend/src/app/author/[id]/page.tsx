"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CircularProgress, Typography, Container, Card, CardContent, Button } from "@mui/material";

// API URL

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
// Fetch author details by ID
const fetchAuthor = async (id: string) => {
  const { data } = await axios.get(`${API_URL}/authors/${id}`);
  return data;
};

export default function AuthorDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: author, error, isLoading } = useQuery({
    queryKey: ["author", params.id],
    queryFn: () => fetchAuthor(params.id),
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Error loading author details.</Typography>;

  return (
    <Container sx={{ textAlign: "center", mt: 4, maxWidth: "600px" }}>
      <Typography variant="h3" sx={{ color: "#007FFF", fontWeight: "bold", mb: 3 }}>
        👤 Author Details
      </Typography>

      <Card sx={{ p: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>{author.name}</Typography>
          {author.bio && <Typography variant="body2" sx={{ mt: 2 }}><strong>Bio:</strong> {author.bio}</Typography>}
          {author.birthYear && <Typography variant="body2"><strong>Born:</strong> {author.birthYear}</Typography>}
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
