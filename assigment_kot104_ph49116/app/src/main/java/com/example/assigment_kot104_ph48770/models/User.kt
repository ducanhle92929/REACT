package com.example.assigment_kot104_ph48770.models

data class User(
    val id: Int? = null, // Server-assigned ID
    val name: String,
    val email: String,
    val password: String,
    val role: Int
)
