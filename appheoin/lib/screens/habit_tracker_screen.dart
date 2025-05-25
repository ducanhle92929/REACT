import 'package:flutter/material.dart';
import 'package:percent_indicator/percent_indicator.dart';
import 'package:intl/intl.dart';
import '../models/habit_model.dart';
import '../services/habit_service.dart';
import 'add_habit_screen.dart';
// Thêm import
import 'habit_detail_screen.dart';
import 'package:flutter/foundation.dart';

class HabitTrackerScreen extends StatefulWidget {
  const HabitTrackerScreen({Key? key}) : super(key: key);

  @override
  State<HabitTrackerScreen> createState() => _HabitTrackerScreenState();
}

class _HabitTrackerScreenState extends State<HabitTrackerScreen> {
  // Service để giao tiếp với API
  late HabitService habitService;
  
  // Danh sách thói quen mặc định (cứng)
  List<Habit> defaultHabits = [];
  
  // Danh sách thói quen do người dùng tạo
  List<Habit> userHabits = [];
  
  // Danh sách thói quen do người dùng tạo đã lọc theo ngày
  List<Habit> filteredUserHabits = [];
  
  // Danh sách tiến độ
  Map<String, int> progress = {};
  
  // Ngày được chọn để lọc
  DateTime selectedDate = DateTime.now();
  
  // Trạng thái đang tải
  bool isLoading = true;
  
  // Trạng thái lỗi
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    
    // Khởi tạo service với địa chỉ IP của máy tính
    // Thay đổi địa chỉ IP này thành địa chỉ IP của máy tính của bạn
    habitService = HabitService(baseUrl: 'http://192.168.1.12:3000');
    
    // Tải dữ liệu
    _loadData();
  }

  // Tải dữ liệu từ server
  Future<void> _loadData() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });
  
    try {
      // Lấy danh sách thói quen từ server
      final habitList = await habitService.getHabits();
      
      // Lấy tiến độ theo ngày
      final progressList = await habitService.getProgressByDate(selectedDate);
      
      // Chuyển đổi danh sách tiến độ thành Map để dễ truy cập
      final progressMap = <String, int>{};
      for (final p in progressList) {
        progressMap[p.habitId] = p.value;
      }
      
      // Tách thói quen mặc định và thói quen do người dùng tạo
      final defaultHabitIds = {
        'default_water_habit',
        'default_exercise_habit',
        'default_meditation_habit',
        'default_reading_habit',
      };
      
      // Lấy thói quen mặc định từ server
      final serverDefaultHabits = habitList.where((habit) => 
        defaultHabitIds.contains(habit.id)
      ).toList();
      
      // Lấy thói quen do người dùng tạo (chỉ loại trừ ID mặc định, KHÔNG loại trừ tên)
      final userCreatedHabits = habitList.where((habit) => 
        !defaultHabitIds.contains(habit.id)
      ).toList();

      // Lọc thói quen theo ngày khởi tạo
      final filteredHabits = _filterHabitsByDate(userCreatedHabits, selectedDate);

      // Log để debug
      print('📊 Chi tiết thói quen:');
      print('   - Tổng thói quen từ server: ${habitList.length}');
      serverDefaultHabits.forEach((h) => print('     Mặc định: ${h.name} (${h.id})'));
      userCreatedHabits.forEach((h) => print('     Người dùng: ${h.name} (${h.id}) - ${h.createdAt}'));
      print('   - Thói quen lọc theo ngày ${_formatDate(selectedDate)}: ${filteredHabits.length}');
      filteredHabits.forEach((h) => print('     Lọc: ${h.name} (${h.id})'));
      
      // Cập nhật state
      if (mounted) {  // Kiểm tra widget còn mounted không
        setState(() {
          defaultHabits = serverDefaultHabits;
          userHabits = userCreatedHabits;
          filteredUserHabits = filteredHabits;
          progress = progressMap;
          isLoading = false;
        });
      }

      // Log để debug
      print('📊 Đã tải dữ liệu:');
      print('   - Thói quen mặc định: ${serverDefaultHabits.length}');
      print('   - Thói quen người dùng: ${userCreatedHabits.length}');
      print('   - Thói quen lọc theo ngày: ${filteredHabits.length}');
      
    } catch (e) {
      if (mounted) {  // Kiểm tra widget còn mounted không
        setState(() {
          errorMessage = 'Không thể tải dữ liệu: $e';
          isLoading = false;
        });
        
        // Hiển thị thông báo lỗi
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi: $e')),
        );
      }
    }
  }

  // Lọc thói quen theo ngày khởi tạo
  List<Habit> _filterHabitsByDate(List<Habit> habits, DateTime date) {
    return habits.where((habit) {
      try {
        // Chuyển đổi chuỗi ngày thành đối tượng DateTime
        final createdAt = DateTime.parse(habit.createdAt);
        
        // So sánh ngày (bỏ qua giờ, phút, giây)
        final isSameDate = createdAt.year == date.year && 
               createdAt.month == date.month && 
               createdAt.day == date.day;
        
        print('🔍 Kiểm tra thói quen ${habit.name}:');
        print('   - Ngày tạo: ${createdAt.toString()}');
        print('   - Ngày lọc: ${date.toString()}');
        print('   - Khớp: $isSameDate');
        
        return isSameDate;
      } catch (e) {
        print('❌ Lỗi parse ngày cho thói quen ${habit.name}: $e');
        return false;
      }
    }).toList();
  }

  // Cập nhật tiến độ
  Future<void> _updateProgress(String habitId, int value) async {
    try {
      // Kiểm tra habitId có hợp lệ không
      if (habitId.isEmpty) {
        throw Exception('habitId không được để trống');
      }

      print('🔄 Cập nhật tiến độ: habitId=$habitId, value=$value');
      
      // Cập nhật tiến độ trên server
      await habitService.updateProgress(habitId, selectedDate, value);
      
      // Cập nhật state
      setState(() {
        progress[habitId] = value;
      });

      print('✅ Cập nhật tiến độ thành công');
    } catch (e) {
      print('❌ Lỗi cập nhật tiến độ: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không thể cập nhật tiến độ: $e')),
      );
    }
  }

  // Chuyển đổi ngày thành chuỗi hiển thị
  String _formatDate(DateTime date) {
    final formatter = DateFormat('dd/MM/yyyy');
    return formatter.format(date);
  }

  // Chuyển đến ngày trước đó
  void _previousDay() {
    setState(() {
      selectedDate = selectedDate.subtract(const Duration(days: 1));
      
      // Lọc lại thói quen theo ngày mới
      filteredUserHabits = _filterHabitsByDate(userHabits, selectedDate);
    });
    _loadData();
  }

  // Chuyển đến ngày tiếp theo
  void _nextDay() {
    setState(() {
      selectedDate = selectedDate.add(const Duration(days: 1));
      
      // Lọc lại thói quen theo ngày mới
      filteredUserHabits = _filterHabitsByDate(userHabits, selectedDate);
    });
    _loadData();
  }

  // Hiển thị dialog chọn ngày
  Future<void> _selectDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
    );
    
    if (picked != null && picked != selectedDate) {
      setState(() {
        selectedDate = picked;
        
        // Lọc lại thói quen theo ngày mới
        filteredUserHabits = _filterHabitsByDate(userHabits, selectedDate);
      });
      _loadData();
    }
  }

  // Xây dựng danh sách thói quen
  Widget _buildHabitList() {
    // Kết hợp thói quen mặc định và thói quen đã lọc theo ngày
    final allHabits = [...defaultHabits, ...filteredUserHabits];
    
    // Nhóm thói quen theo danh mục
    final Map<String, List<Habit>> habitsByCategory = {};
    
    for (final habit in allHabits) {
      if (!habitsByCategory.containsKey(habit.category)) {
        habitsByCategory[habit.category] = [];
      }
      habitsByCategory[habit.category]!.add(habit);
    }
    
    // Danh sách các danh mục
    final categories = getDefaultCategories();
    
    return ListView(
      padding: const EdgeInsets.all(16.0),
      children: [
        // Hiển thị từng danh mục
        for (final category in categories)
          if (habitsByCategory.containsKey(category.id))
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Tiêu đề danh mục
                Padding(
                  padding: const EdgeInsets.only(bottom: 8.0),
                  child: Text(
                    category.name,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: _getCategoryColor(category.color),
                    ),
                  ),
                ),
                
                // Danh sách thói quen trong danh mục
                ...habitsByCategory[category.id]!.map((habit) => _buildHabitItem(habit)),
                
                const SizedBox(height: 16),
              ],
            ),
        
        // Nếu không có thói quen nào được tạo vào ngày này
        if (filteredUserHabits.isEmpty && defaultHabits.isEmpty)
          const Center(
            child: Padding(
              padding: EdgeInsets.all(16.0),
              child: Text(
                'Không có thói quen nào. Hãy thêm thói quen mới!',
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
            ),
          ),
      ],
    );
  }

  // Xây dựng item thói quen
  Widget _buildHabitItem(Habit habit) {
    // Lấy tiến độ hiện tại
    final current = progress[habit.id] ?? 0;
    
    // Tính phần trăm hoàn thành
    final progressPercent = habit.target > 0 ? current / habit.target : 0.0;
    
    // Kiểm tra xem có phải thói quen mặc định không
    final defaultHabitIds = {
      'default_water_habit',
      'default_exercise_habit',
      'default_meditation_habit',
      'default_reading_habit',
    };
    final isDefaultHabit = defaultHabitIds.contains(habit.id);
    
    return GestureDetector(
      onTap: () async {
        // Chuyển đến màn hình chi tiết thói quen
        await Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => HabitDetailScreen(habit: habit),
          ),
        );
        
        // Tải lại dữ liệu khi quay lại
        _loadData();
      },
      onLongPress: () async {
        // Hiển thị menu tùy chọn (chỉ cho thói quen do người dùng tạo)
        if (!isDefaultHabit) {
          await _showOptionsDialog(habit);
        }
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12.0),
        padding: const EdgeInsets.all(16.0),
        decoration: BoxDecoration(
          color: _getBackgroundColor(habit.color),
          borderRadius: BorderRadius.circular(12.0),
          border: current > 0
              ? Border.all(color: _getBorderColor(habit.color), width: 1.5)
              : null,
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8.0),
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
              child: Icon(
                _getIconData(habit.iconIndex),
                color: _getIconColor(habit.color),
                size: 24,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          habit.name,
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                        ),
                      ),
                      if (isDefaultHabit)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.grey.shade200,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            'Mặc định',
                            style: TextStyle(fontSize: 10, color: Colors.black54),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '$current/${habit.target} ${habit.unit}',
                    style: const TextStyle(fontSize: 14, color: Colors.black87),
                  ),
                  if (!isDefaultHabit) ...[
                    const SizedBox(height: 4),
                    Text(
                      'Tạo ngày: ${_formatDate(DateTime.parse(habit.createdAt))}',
                      style: const TextStyle(fontSize: 12, color: Colors.black54),
                    ),
                  ],
                  const SizedBox(height: 8),
                  LinearPercentIndicator(
                    lineHeight: 8.0,
                    percent: progressPercent > 1.0 ? 1.0 : progressPercent,
                    backgroundColor: Colors.grey.shade300,
                    progressColor: _getProgressColor(habit.color),
                    barRadius: const Radius.circular(4),
                    padding: EdgeInsets.zero,
                  ),
                ],
              ),
            ),
            // Thêm nút cập nhật tiến độ nhanh cho thói quen mặc định
            if (isDefaultHabit)
              IconButton(
                icon: Icon(
                  Icons.add_circle_outline,
                  color: _getIconColor(habit.color),
                ),
                onPressed: () => _updateProgress(habit.id, current + 1),
              ),
          ],
        ),
      ),
    );
  }

  // Hiển thị dialog tùy chọn
  Future<void> _showOptionsDialog(Habit habit) async {
    await showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(habit.name),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.edit),
                title: const Text('Chỉnh sửa'),
                onTap: () async {
                  Navigator.pop(context);
                  final result = await Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => AddHabitScreen(habit: habit),
                    ),
                  );
                  
                  if (result == true) {
                    _loadData();
                  }
                },
              ),
              ListTile(
                leading: const Icon(Icons.delete, color: Colors.red),
                title: const Text('Xóa', style: TextStyle(color: Colors.red)),
                onTap: () {
                  Navigator.pop(context);
                  _showDeleteConfirmation(habit);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  // Hiển thị dialog xác nhận xóa
  Future<void> _showDeleteConfirmation(Habit habit) async {
    await showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Xác nhận xóa'),
          content: Text('Bạn có chắc muốn xóa thói quen "${habit.name}"?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Hủy'),
            ),
            TextButton(
              onPressed: () async {
                Navigator.pop(context);
                try {
                  await habitService.deleteHabit(habit.id);
                  _loadData();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Đã xóa thói quen thành công')),
                  );
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Không thể xóa thói quen: $e')),
                  );
                }
              },
              child: const Text('Xóa', style: TextStyle(color: Colors.red)),
            ),
          ],
        );
      },
    );
  }

  // Lấy màu nền dựa trên màu thói quen
  Color _getBackgroundColor(String color) {
    switch (color) {
      case 'blue':
        return Colors.blue.shade100;
      case 'orange':
        return Colors.orange.shade100;
      case 'green':
        return Colors.green.shade100;
      default:
        return Colors.grey.shade100;
    }
  }

  // Lấy màu viền dựa trên màu thói quen
  Color _getBorderColor(String color) {
    switch (color) {
      case 'blue':
        return Colors.blue;
      case 'orange':
        return Colors.orange;
      case 'green':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  // Lấy màu tiến độ dựa trên màu thói quen
  Color _getProgressColor(String color) {
    switch (color) {
      case 'blue':
        return Colors.blue;
      case 'orange':
        return Colors.orange;
      case 'green':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  // Lấy màu icon dựa trên màu thói quen
  Color _getIconColor(String color) {
    switch (color) {
      case 'blue':
        return Colors.blue;
      case 'orange':
        return Colors.orange;
      case 'green':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  // Lấy màu danh mục
  Color _getCategoryColor(String color) {
    switch (color) {
      case 'blue':
        return Colors.blue;
      case 'orange':
        return Colors.orange;
      case 'green':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  // Lấy icon dựa trên index
  IconData _getIconData(int index) {
    final icons = [
      Icons.water_drop,
      Icons.self_improvement,
      Icons.spa,
      Icons.menu_book,
      Icons.fitness_center,
      Icons.sports_soccer,
      Icons.code,
      Icons.music_note,
    ];
    
    if (index >= 0 && index < icons.length) {
      return icons[index];
    }
    
    return Icons.check_circle_outline;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                // AppBar with back button
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back, color: Colors.blue),
                        onPressed: () {
                          Navigator.pop(context);
                        },
                      ),
                      const Expanded(
                        child: Center(
                          child: Text(
                            'Thói Quen',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 24), // Placeholder to balance layout
                    ],
                  ),
                ),

                // Phần lọc theo ngày
                Container(
                  padding: const EdgeInsets.all(16.0),
                  color: Colors.blue.shade50,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Lọc thói quen theo ngày tạo:',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          // Nút ngày trước
                          IconButton(
                            icon: const Icon(Icons.arrow_back_ios, size: 18),
                            onPressed: _previousDay,
                          ),

                          // Hiển thị ngày đã chọn
                          Expanded(
                            child: GestureDetector(
                              onTap: _selectDate,
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 12.0),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(8.0),
                                  border: Border.all(color: Colors.blue.shade200),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Icon(Icons.calendar_today, size: 18, color: Colors.blue),
                                    const SizedBox(width: 8),
                                    Text(
                                      _formatDate(selectedDate),
                                      style: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),

                          // Nút ngày sau
                          IconButton(
                            icon: const Icon(Icons.arrow_forward_ios, size: 18),
                            onPressed: _nextDay,
                          ),
                        ],
                      ),

                      // Hiển thị thông tin về số thói quen
                      const SizedBox(height: 8),
                      Text(
                        'Có ${filteredUserHabits.length} thói quen được tạo vào ngày này',
                        style: const TextStyle(
                          fontSize: 14,
                          fontStyle: FontStyle.italic,
                          color: Colors.black54,
                        ),
                      ),
                    ],
                  ),
                ),

                // Danh sách thói quen
                Expanded(
                  child: isLoading
                      ? const Center(child: CircularProgressIndicator())
                      : errorMessage != null
                          ? Center(child: Text(errorMessage!))
                          : _buildHabitList(),
                ),
              ],
            ),
          ],
        ),
      ),

      // Nút thêm
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          print('🔄 Bắt đầu tạo thói quen mới...');

          // Chuyển đến màn hình thêm thói quen và đợi kết quả
          final result = await Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AddHabitScreen()),
          );

          print('📥 Kết quả từ AddHabitScreen: $result');

          // Nếu kết quả là true (đã lưu thành công), tải lại dữ liệu
          if (result == true) {
            print('✅ Thói quen đã được tạo, đang tải lại dữ liệu...');

            // Hiển thị thông báo đang tải
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Đang cập nhật danh sách thói quen...')),
            );

            // Đặt lại ngày về hôm nay để thấy thói quen mới tạo
            setState(() {
              selectedDate = DateTime.now();
            });

            // Tải lại dữ liệu
            await _loadData();

            print('🎉 Đã tải lại dữ liệu xong!');
          } else {
            print('❌ Không tạo thói quen hoặc có lỗi');
          }
        },
        backgroundColor: Colors.blue,
        child: const Icon(Icons.add),
      ),

      // Thanh điều hướng dưới
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.bar_chart), label: 'Analysis'),
          BottomNavigationBarItem(icon: Icon(Icons.access_time), label: 'Setting'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}
