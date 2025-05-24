import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:percent_indicator/percent_indicator.dart';
import '../models/habit_model.dart';
import '../services/habit_service.dart';

class HabitDetailScreen extends StatefulWidget {
  final Habit habit;
  
  const HabitDetailScreen({
    Key? key,
    required this.habit,
  }) : super(key: key);

  @override
  State<HabitDetailScreen> createState() => _HabitDetailScreenState();
}

class _HabitDetailScreenState extends State<HabitDetailScreen> {
  // Service để giao tiếp với API
  late HabitService habitService;
  
  // Tiến độ hiện tại
  int currentProgress = 0;
  
  // Dữ liệu tiến độ theo ngày (7 ngày gần nhất)
  List<Map<String, dynamic>> weeklyProgress = [];
  
  // Số ngày đã hoàn thành trong 7 ngày gần đây
  int completedDaysIn7Days = 0;
  
  // Số ngày đã hoàn thành trong 1 ngày gần đây
  int completedDaysIn1Day = 0;
  
  // Tỷ lệ hoàn thành
  double completionRate = 0.0;
  
  // Trạng thái đang tải
  bool isLoading = true;
  
  // Ngày hiện tại
  DateTime today = DateTime.now();
  
  // Ngày được chọn
  late DateTime selectedDate;

  @override
  void initState() {
    super.initState();
    
    // Khởi tạo ngày được chọn là ngày hiện tại
    selectedDate = DateTime(today.year, today.month, today.day);
    
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
    });
    
    try {
      // Lấy tiến độ của ngày được chọn
      final selectedDateProgressList = await habitService.getProgressByDate(selectedDate);
      
      // Tìm tiến độ của thói quen hiện tại
      final selectedDateProgress = selectedDateProgressList.firstWhere(
        (progress) => progress.habitId == widget.habit.id,
        orElse: () => HabitProgress(
          id: '',
          habitId: widget.habit.id,
          date: DateFormat('yyyy-MM-dd').format(selectedDate),
          value: 0,
          updatedAt: selectedDate.toIso8601String(),
        ),
      );
      
      // Lấy dữ liệu 7 ngày gần nhất
      final weeklyData = await _fetchWeeklyData();
      
      // Tính số ngày đã hoàn thành trong 7 ngày gần đây
      final completed7Days = _calculateCompletedDays(weeklyData);
      
      // Tính số ngày đã hoàn thành trong 1 ngày gần đây
      final completed1Day = _isCompletedToday(weeklyData) ? 1 : 0;
      
      // Tính tỷ lệ hoàn thành
      final rate = _calculateCompletionRate(weeklyData);
      
      // Cập nhật state
      if (mounted) {
        setState(() {
          currentProgress = selectedDateProgress.value;
          weeklyProgress = weeklyData;
          completedDaysIn7Days = completed7Days;
          completedDaysIn1Day = completed1Day;
          completionRate = rate;
          isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          isLoading = false;
        });
        
        // Hiển thị thông báo lỗi
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi khi tải dữ liệu: $e')),
        );
      }
    }
  }

  // Lấy dữ liệu 7 ngày gần nhất
  Future<List<Map<String, dynamic>>> _fetchWeeklyData() async {
    final result = <Map<String, dynamic>>[];
    
    // Lấy dữ liệu 7 ngày gần nhất
    for (int i = 6; i >= 0; i--) {
      final date = today.subtract(Duration(days: i));
      final formattedDate = DateFormat('yyyy-MM-dd').format(date);
      
      try {
        final progressList = await habitService.getProgressByDate(date);
        
        // Tìm tiến độ của thói quen hiện tại
        final progress = progressList.firstWhere(
          (p) => p.habitId == widget.habit.id,
          orElse: () => HabitProgress(
            id: '',
            habitId: widget.habit.id,
            date: formattedDate,
            value: 0,
            updatedAt: date.toIso8601String(),
          ),
        );
        
        // Thêm vào danh sách kết quả
        result.add({
          'date': date,
          'value': progress.value,
          'isCompleted': progress.value >= widget.habit.target,
          'weekday': _getWeekdayName(date.weekday),
        });
      } catch (e) {
        // Nếu có lỗi, thêm dữ liệu mặc định
        result.add({
          'date': date,
          'value': 0,
          'isCompleted': false,
          'weekday': _getWeekdayName(date.weekday),
        });
      }
    }
    
    return result;
  }

  // Tính số ngày đã hoàn thành trong 7 ngày gần đây
  int _calculateCompletedDays(List<Map<String, dynamic>> data) {
    return data.where((day) => day['isCompleted'] == true).length;
  }

  // Kiểm tra xem hôm nay đã hoàn thành chưa
  bool _isCompletedToday(List<Map<String, dynamic>> data) {
    // Tìm dữ liệu của ngày hôm nay
    final todayData = data.firstWhere(
      (day) {
        final date = day['date'] as DateTime;
        return date.year == today.year && 
               date.month == today.month && 
               date.day == today.day;
      },
      orElse: () => {'isCompleted': false},
    );
    
    return todayData['isCompleted'] == true;
  }

  // Tính tỷ lệ hoàn thành
  double _calculateCompletionRate(List<Map<String, dynamic>> data) {
    if (data.isEmpty) return 0.0;
    
    int completed = 0;
    
    for (final day in data) {
      if (day['isCompleted']) {
        completed++;
      }
    }
    
    return completed / data.length;
  }

  // Lấy tên thứ trong tuần
  String _getWeekdayName(int weekday) {
    switch (weekday) {
      case 1: return 'T2';
      case 2: return 'T3';
      case 3: return 'T4';
      case 4: return 'T5';
      case 5: return 'T6';
      case 6: return 'T7';
      case 7: return 'CN';
      default: return '';
    }
  }

  // Kiểm tra xem có thể đánh dấu hoàn thành không
  bool _canMarkAsCompleted() {
    // Chỉ cho phép đánh dấu hoàn thành cho ngày hiện tại
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final selected = DateTime(selectedDate.year, selectedDate.month, selectedDate.day);
    
    return today.isAtSameMomentAs(selected);
  }

  // Lấy thông báo về trạng thái đánh dấu
  String _getMarkCompletionMessage() {
    if (!_canMarkAsCompleted()) {
      final now = DateTime.now();
      final today = DateTime(now.year, now.month, now.day);
      final selected = DateTime(selectedDate.year, selectedDate.month, selectedDate.day);
      
      if (selected.isBefore(today)) {
        return 'Không thể đánh dấu cho ngày đã qua';
      } else {
        return 'Không thể đánh dấu cho ngày trong tương lai';
      }
    }
    
    if (currentProgress >= widget.habit.target) {
      return 'Đã hoàn thành';
    }
    
    return 'Đánh dấu đã hoàn thành';
  }

  // Tăng tiến độ lên 1 đơn vị
  Future<void> _incrementProgress() async {
    // Kiểm tra ID có hợp lệ không
    if (widget.habit.id.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Lỗi: ID thói quen không hợp lệ')),
      );
      return;
    }

    // Kiểm tra xem có thể đánh dấu không
    if (!_canMarkAsCompleted()) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(_getMarkCompletionMessage())),
      );
      return;
    }
    
    // Kiểm tra xem đã đạt mục tiêu chưa
    if (currentProgress >= widget.habit.target) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Đã đạt mục tiêu!')),
      );
      return;
    }
    
    try {
      // Tăng tiến độ lên 1 đơn vị
      final newProgress = currentProgress + 1;
      
      // Cập nhật tiến độ
      await habitService.updateProgress(
        widget.habit.id,
        selectedDate,
        newProgress,
      );
      
      // Cập nhật state
      setState(() {
        currentProgress = newProgress;
      });
      
      // Hiển thị thông báo thành công
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Đã tăng tiến độ lên $newProgress/${widget.habit.target} ${widget.habit.unit}!')),
      );
      
      // Tải lại dữ liệu
      _loadData();
    } catch (e) {
      // Hiển thị thông báo lỗi
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi khi cập nhật tiến độ: $e')),
      );
    }
  }

  // Đánh dấu hoàn thành
  Future<void> _markAsCompleted() async {
    // Kiểm tra ID có hợp lệ không
    if (widget.habit.id.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Lỗi: ID thói quen không hợp lệ')),
      );
      return;
    }

    // Kiểm tra xem có thể đánh dấu không
    if (!_canMarkAsCompleted()) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(_getMarkCompletionMessage())),
      );
      return;
    }
    
    // Kiểm tra xem đã đạt mục tiêu chưa
    if (currentProgress >= widget.habit.target) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Đã đạt mục tiêu!')),
      );
      return;
    }
    
    try {
      // Cập nhật tiến độ lên giá trị mục tiêu
      await habitService.updateProgress(
        widget.habit.id,
        selectedDate,
        widget.habit.target,
      );
      
      // Cập nhật state
      setState(() {
        currentProgress = widget.habit.target;
      });
      
      // Hiển thị thông báo thành công
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Đã đánh dấu hoàn thành!')),
      );
      
      // Tải lại dữ liệu
      _loadData();
    } catch (e) {
      // Hiển thị thông báo lỗi
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi khi cập nhật tiến độ: $e')),
      );
    }
  }

  // Kiểm tra xem đơn vị có phải là đơn vị đếm không
  bool _isCountingUnit() {
    return widget.habit.unit == 'Ly' || 
           widget.habit.unit == 'Lần' || 
           widget.habit.unit == 'Buổi';
  }

  // Lấy màu dựa trên loại thói quen
  Color _getHabitColor() {
    switch (widget.habit.color) {
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

  // Lấy icon dựa trên loại thói quen
  IconData _getHabitIcon() {
    return _getIconData(widget.habit.iconIndex);
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
    final habitColor = _getHabitColor();
    final habitIcon = _getHabitIcon();
    final isCountingUnit = _isCountingUnit();
    
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.blue),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Chi Tiết',
          style: TextStyle(
            color: Colors.black,
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
        centerTitle: true,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Thông tin thói quen
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.1),
                          spreadRadius: 1,
                          blurRadius: 10,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 50,
                          height: 50,
                          decoration: BoxDecoration(
                            color: habitColor.withOpacity(0.2),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            habitIcon,
                            color: habitColor,
                            size: 28,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                widget.habit.name,
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.black87,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Mục tiêu: ${widget.habit.target} ${widget.habit.unit} mỗi ngày',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey[600],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Thống kê
                  Row(
                    children: [
                      Expanded(
                        child: _StatCard(
                          value: completedDaysIn1Day.toString(),
                          label: '1 ngày',
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _StatCard(
                          value: completedDaysIn7Days.toString(),
                          label: '7 ngày',
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _StatCard(
                          value: '${(completionRate * 100).toInt()}%',
                          label: 'Tỷ lệ',
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Biểu đồ
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.1),
                          spreadRadius: 1,
                          blurRadius: 10,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Mục tiêu',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.black87,
                          ),
                        ),
                        const SizedBox(height: 20),
                        SizedBox(
                          height: 200,
                          child: _buildBarChart(habitColor),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Tiến độ hôm nay
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.1),
                          spreadRadius: 1,
                          blurRadius: 10,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Hôm nay: $currentProgress/${widget.habit.target} ${widget.habit.unit}',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.black87,
                          ),
                        ),
                        const SizedBox(height: 16),
                        SizedBox(
                          width: double.infinity,
                          child: Container(
                            height: 8,
                            decoration: BoxDecoration(
                              color: Colors.grey[200],
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: FractionallySizedBox(
                              alignment: Alignment.centerLeft,
                              widthFactor: widget.habit.target > 0
                                  ? (currentProgress / widget.habit.target).clamp(0.0, 1.0)
                                  : 0.0,
                              child: Container(
                                decoration: BoxDecoration(
                                  color: habitColor,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Nút đánh dấu hoàn thành
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      children: [
                        // Nút tăng tiến độ (chỉ hiển thị cho đơn vị đếm)
                        if (isCountingUnit && _canMarkAsCompleted() && currentProgress < widget.habit.target)
                          SizedBox(
                            width: double.infinity,
                            height: 50,
                            child: ElevatedButton(
                              onPressed: _incrementProgress,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: habitColor.withOpacity(0.8),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                elevation: 0,
                              ),
                              child: Text(
                                'Tăng tiến độ (+1 ${widget.habit.unit})',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                        
                        if (isCountingUnit && _canMarkAsCompleted() && currentProgress < widget.habit.target)
                          const SizedBox(height: 12),
                        
                        // Nút đánh dấu hoàn thành
                        SizedBox(
                          width: double.infinity,
                          height: 50,
                          child: ElevatedButton(
                            onPressed: _canMarkAsCompleted() && currentProgress < widget.habit.target
                                ? _markAsCompleted
                                : null,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: habitColor,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              elevation: 0,
                              disabledBackgroundColor: Colors.grey[300],
                            ),
                            child: Text(
                              _getMarkCompletionMessage(),
                              style: TextStyle(
                                color: _canMarkAsCompleted() && currentProgress < widget.habit.target
                                    ? Colors.white
                                    : Colors.grey[600],
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.1),
              spreadRadius: 1,
              blurRadius: 4,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: BottomNavigationBar(
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.white,
          selectedItemColor: Colors.blue,
          unselectedItemColor: Colors.grey,
          currentIndex: 0,
          elevation: 0,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.bar_chart),
              label: 'Analysis',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.access_time),
              label: 'Setting',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }

  // Xây dựng biểu đồ cột
  Widget _buildBarChart(Color barColor) {
    if (weeklyProgress.isEmpty) {
      return const Center(child: Text('Không có dữ liệu'));
    }
    
    // Tìm giá trị lớn nhất để tỷ lệ biểu đồ
    final maxValue = widget.habit.target.toDouble();
    
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: weeklyProgress.map((day) {
        final value = day['value'] as int;
        final weekday = day['weekday'] as String;
        final isCompleted = day['isCompleted'] as bool;
        
        // Tính chiều cao của cột
        final double barHeight = maxValue > 0
            ? (value / maxValue).clamp(0.0, 1.0) * 150
            : 0.0;
        
        return Column(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Container(
              width: 30,
              height: barHeight,
              decoration: BoxDecoration(
                color: isCompleted ? barColor : barColor.withOpacity(0.5),
                borderRadius: BorderRadius.circular(4),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              weekday,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
            ),
          ],
        );
      }).toList(),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String value;
  final String label;
  
  const _StatCard({
    required this.value,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Text(
            value,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey[600],
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
