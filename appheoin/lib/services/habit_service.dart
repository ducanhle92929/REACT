import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/habit_model.dart';
import 'package:intl/intl.dart';

class HabitService {
  // URL của API server
  final String baseUrl;
  
  HabitService({required this.baseUrl});

  // Format ngày thành chuỗi YYYY-MM-DD
  String _formatDate(DateTime date) {
    return DateFormat('yyyy-MM-dd').format(date);
  }

  // Lấy danh sách thói quen
  Future<List<Habit>> getHabits() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/api/habits'));
      
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Habit.fromJson(json)).toList();
      } else {
        throw Exception('Không thể lấy danh sách thói quen: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      throw Exception('Lỗi khi lấy danh sách thói quen: $e');
    }
  }

  // Lấy chi tiết thói quen
  Future<Habit> getHabit(String id) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/api/habits/$id'));
      
      if (response.statusCode == 200) {
        return Habit.fromJson(json.decode(response.body));
      } else {
        throw Exception('Không thể lấy chi tiết thói quen: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      throw Exception('Lỗi khi lấy chi tiết thói quen: $e');
    }
  }

  // Tạo thói quen mới
  Future<Habit> createHabit(Habit habit) async {
    try {
      print('🚀 Đang gửi yêu cầu tạo thói quen mới: ${habit.name}');
      print('📝 Dữ liệu gửi: ${habit.toJson()}');
      
      final response = await http.post(
        Uri.parse('$baseUrl/api/habits'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(habit.toJson()),
      );
      
      print('📥 Response status: ${response.statusCode}');
      print('📥 Response body: ${response.body}');
      
      if (response.statusCode == 201) {
        final responseData = json.decode(response.body);
        
        // Kiểm tra ID trong response
        if (responseData['id'] == null || responseData['id'].toString().isEmpty) {
          print('❌ Lỗi: Server trả về ID rỗng hoặc null');
          throw Exception('Server trả về ID không hợp lệ');
        }
        
        // Tạo đối tượng Habit từ response
        final newHabit = Habit.fromJson(responseData);
        
        // Kiểm tra lại ID sau khi parse
        if (newHabit.id.isEmpty) {
          print('❌ Lỗi: ID của thói quen mới tạo rỗng sau khi parse');
          throw Exception('ID của thói quen mới tạo không hợp lệ sau khi parse');
        }
        
        print('✅ Thói quen mới tạo thành công: ${newHabit.name} với ID: ${newHabit.id}');
        return newHabit;
      } else {
        throw Exception('Không thể tạo thói quen mới: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      print('❌ Lỗi khi tạo thói quen mới: $e');
      throw Exception('Lỗi khi tạo thói quen mới: $e');
    }
  }

  // Cập nhật thói quen
  Future<Habit> updateHabit(Habit habit) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/api/habits/${habit.id}'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(habit.toJson()),
      );
      
      if (response.statusCode == 200) {
        return Habit.fromJson(json.decode(response.body));
      } else {
        throw Exception('Không thể cập nhật thói quen: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      throw Exception('Lỗi khi cập nhật thói quen: $e');
    }
  }

  // Xóa thói quen
  Future<void> deleteHabit(String id) async {
    try {
      final response = await http.delete(Uri.parse('$baseUrl/api/habits/$id'));
      
      if (response.statusCode != 200) {
        throw Exception('Không thể xóa thói quen: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      throw Exception('Lỗi khi xóa thói quen: $e');
    }
  }

  // Lấy tiến độ theo ngày
  Future<List<HabitProgress>> getProgressByDate(DateTime date) async {
    try {
      final formattedDate = _formatDate(date);
      final response = await http.get(
        Uri.parse('$baseUrl/api/progress?date=$formattedDate'),
      );
      
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => HabitProgress.fromJson(json)).toList();
      } else {
        throw Exception('Không thể lấy tiến độ: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      throw Exception('Lỗi khi lấy tiến độ: $e');
    }
  }

  // Cập nhật tiến độ
  Future<void> updateProgress(String habitId, DateTime date, int value) async {
    try {
      // Kiểm tra habitId có hợp lệ không
      if (habitId.isEmpty) {
        throw Exception('habitId không được để trống');
      }
      
      final formattedDate = _formatDate(date);
      
      print('Cập nhật tiến độ: habitId=$habitId, date=$formattedDate, value=$value');
      
      final response = await http.post(
        Uri.parse('$baseUrl/api/progress'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'habitId': habitId,
          'date': formattedDate,
          'value': value,
        }),
      );
      
      print('Kết quả cập nhật tiến độ: ${response.statusCode} - ${response.body}');
      
      if (response.statusCode != 200) {
        throw Exception('Không thể cập nhật tiến độ: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      print('Lỗi khi cập nhật tiến độ: $e');
      throw Exception('Lỗi khi cập nhật tiến độ: $e');
    }
  }
}
