import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, Box } from "@mui/material";
import { supabase } from "../data/db";

export default function UserDetails() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchUserProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");

        // Fetch additional profile info from 'profiles' table if available
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        if (data) {
          setUsername(data.username || "");
        }
      }
    }
    fetchUserProfile();
  }, []);

  async function updateProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage("User not authenticated");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, username });

    if (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile");
    } else {
      setMessage("Profile updated successfully");
    }
  }

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        User Details
      </Typography>

      <TextField
        fullWidth
        label="Email"
        value={email}
        disabled
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={updateProfile}>
        Save
      </Button>

      {message && (
        <Typography sx={{ mt: 2 }} color={message.includes("Failed") ? "error" : "primary"}>
          {message}
        </Typography>
      )}
    </Box>
  );
}
