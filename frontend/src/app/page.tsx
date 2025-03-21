"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  CircularProgress,
  Typography,
  Container,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Fetch books
const fetchBooks = async () => {
  const { data } = await axios.get(`${API_URL}/books`);
  return data;
};

export default function BooksPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [newBook, setNewBook] = useState({ title: "", authorName: "", publishedYear: "", price: "" });
  const [editBook, setEditBook] = useState(null);

  const { data: books, error, isLoading } = useQuery({ queryKey: ["books"], queryFn: fetchBooks });

  // ✅ Add Book Mutation
  const addBookMutation = useMutation({
    mutationFn: async (book) => {
      const response = await axios.post(`${API_URL}/books`, book);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      setNewBook({ title: "", authorName: "", publishedYear: "", price: "" });
    },
  });

  // ✅ Update Book Mutation
  const updateBookMutation = useMutation({
    mutationFn: async ({ id, updatedBook }: { id: number; updatedBook: any }) => {
      const response = await axios.put(`${API_URL}/books/${id}`, updatedBook);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      setEditBook(null);
    },
  });

  // ✅ Delete Book Mutation
  const deleteBookMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${API_URL}/books/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
    },
    onError: (error) => {
      console.error("Failed to delete book:", error);
      alert("Error: Unable to delete the book. It might be referenced by another entity.");
    },
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Error loading books. Please check your API.</Typography>;

  return (
    <Container sx={{ textAlign: "center", mt: 4, maxWidth: "800px" }}>
      <Typography variant="h3" sx={{ color: "#007FFF", fontWeight: "bold", mb: 3 }}>
        📚 Library Management
      </Typography>

      {/* 📌 Add Book Form */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ color: "#1976D2", fontWeight: "bold" }}>Add a New Book</Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newBook.title || !newBook.authorName || !newBook.publishedYear || !newBook.price) {
              alert("All fields are required!");
              return;
            }
            addBookMutation.mutate(newBook);
          }}
        >
          <TextField label="Title" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} required />
          <TextField label="Author Name" value={newBook.authorName} onChange={(e) => setNewBook({ ...newBook, authorName: e.target.value })} required />
          <TextField label="Published Year" type="number" value={newBook.publishedYear} onChange={(e) => setNewBook({ ...newBook, publishedYear: e.target.value })} required />
          <TextField label="Price" type="number" value={newBook.price} onChange={(e) => setNewBook({ ...newBook, price: e.target.value })} required />
          <Button type="submit" variant="contained" sx={{ backgroundColor: "#28A745", color: "white" }}>Add Book</Button>
        </form>
      </Card>

      {/* 📌 Display Books */}
      <Grid container spacing={2}>
        {books?.map((book) => (
          <Grid item xs={12} sm={6} key={book.id}>
            <Card
              sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}
              onClick={() => router.push(`/book/${book.id}`)} // ✅ Click to View Book Details
            >
              <CardContent>
                <Typography variant="h6">{book.title}</Typography>
                <Typography>Author: {book.author?.name || "Unknown"}</Typography>
                <Typography>Published: {book.publishedYear}</Typography>
                <Typography>${book.price}</Typography>
              </CardContent>
              <CardActions>
                <Button onClick={(e) => { e.stopPropagation(); setEditBook(book); }}>Edit</Button>
                <Button color="error" onClick={(e) => { e.stopPropagation(); deleteBookMutation.mutate(book.id); }}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 📌 Edit Book Modal */}
      {editBook && (
        <Dialog open={Boolean(editBook)} onClose={() => setEditBook(null)}>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogContent>
            <TextField label="Title" fullWidth value={editBook.title} onChange={(e) => setEditBook({ ...editBook, title: e.target.value })} />
            <TextField label="Author Name" fullWidth value={editBook.author?.name || ""} onChange={(e) => setEditBook({ ...editBook, author: { name: e.target.value } })} />
            <TextField label="Published Year" fullWidth type="number" value={editBook.publishedYear} onChange={(e) => setEditBook({ ...editBook, publishedYear: e.target.value })} />
            <TextField label="Price" fullWidth type="number" value={editBook.price} onChange={(e) => setEditBook({ ...editBook, price: e.target.value })} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditBook(null)}>Cancel</Button>
            <Button variant="contained" sx={{ backgroundColor: "#1976D2", color: "white" }} onClick={() => updateBookMutation.mutate({ id: editBook.id, updatedBook: editBook })}>Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
}
