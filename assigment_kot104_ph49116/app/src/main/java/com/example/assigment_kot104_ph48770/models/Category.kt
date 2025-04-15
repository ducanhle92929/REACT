package com.example.assigment_kot104_ph48770.models
import android.os.Parcelable
import kotlinx.android.parcel.Parcelize
@Parcelize
class Category (
    val id: String,
    val name: String,
    val image: String,

) : Parcelable