package com.example.assigment_kot104_ph48770.models
import android.os.Parcelable
import kotlinx.android.parcel.Parcelize
@Parcelize
class Product (
    val id: String,
    val name: String,
    val price: Double,
    val image: String,
    val categoryName: String // Add this field if needed
) : Parcelable