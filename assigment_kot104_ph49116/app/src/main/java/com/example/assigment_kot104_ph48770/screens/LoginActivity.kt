package com.example.assigment_kot104_ph48770.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.example.assigment_kot104_ph48770.R
import com.example.assigment_kot104_ph48770.navigations.ROUTE_NAME
import com.example.assigment_kot104_ph48770.service.RetrofitInstance
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(navController: NavHostController) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var emailError by remember { mutableStateOf<String?>(null) }
    var passwordError by remember { mutableStateOf<String?>(null) }
    var loginError by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    fun validateInputs(): Boolean {
        emailError = if (email.isBlank()) "Email cannot be empty"
        else if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) "Invalid email format"
        else null

        passwordError = if (password.isBlank()) "Password cannot be empty"
        else if (password.length < 6) "Password must be at least 6 characters"
        else null

        return emailError == null && passwordError == null
    }

    fun login() {
        if (!validateInputs()) return

        scope.launch {
            try {
                val users = RetrofitInstance.api.getUsers(email)
                val user = users.find { it.email == email && it.password == password }
                if (user != null) {
                    when (user.role) {
                        1 -> navController.navigate(ROUTE_NAME.home.name)
                        2 -> navController.navigate(ROUTE_NAME.admin.name)
                        else -> loginError = "Invalid user role"
                    }
                } else {
                    loginError = "Invalid email or password"
                }
            } catch (e: Exception) {
                loginError = "Login failed: ${e.message}"
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(60.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Divider(modifier = Modifier.weight(1f), color = Color.LightGray, thickness = 1.dp)
                Box(
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                        .size(80.dp)
                        .clip(CircleShape)
                        .background(Color.White)
                        .padding(16.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.group),
                        contentDescription = "App Logo",
                        modifier = Modifier.size(48.dp)
                    )
                }
                Divider(modifier = Modifier.weight(1f), color = Color.LightGray, thickness = 1.dp)
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "HELLO !",
                fontSize = 30.sp,
                color = Color.Gray,
                fontWeight = FontWeight.Normal
            )

            Text(
                text = "WELCOME BACK",
                fontSize = 35.sp,
                color = Color.DarkGray,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(40.dp))

            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Email") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                isError = emailError != null,
                supportingText = { if (emailError != null) Text(text = emailError ?: "", color = MaterialTheme.colorScheme.error) }
            )

            Spacer(modifier = Modifier.height(16.dp))

            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("Password") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                trailingIcon = {
                    IconButton(onClick = { passwordVisible = !passwordVisible }) {
                        Icon(
                            imageVector = if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                            contentDescription = if (passwordVisible) "Hide password" else "Show password"
                        )
                    }
                },
                isError = passwordError != null,
                supportingText = { if (passwordError != null) Text(text = passwordError ?: "", color = MaterialTheme.colorScheme.error) }
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Forgot Password",
                modifier = Modifier
                    .align(Alignment.End)
                    .clickable { /* TODO: Implement forgot password */ },
                color = Color.Gray,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium
            )

            Spacer(modifier = Modifier.height(24.dp))

            loginError?.let {
                Text(
                    text = it,
                    color = MaterialTheme.colorScheme.error,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
            }

            Button(
                onClick = { login() },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color.Black)
            ) {
                Text(
                    text = "Log in",
                    fontSize = 20.sp,
                    color = Color.White,
                    fontWeight = FontWeight.Medium
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = { navController.navigate(ROUTE_NAME.signup.name) },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color.White)
            ) {
                Text(
                    text = "SIGN UP",
                    fontSize = 20.sp,
                    color = Color.Black,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}