import 'package:flutter/material.dart';
import '../models/habit_model.dart';
import '../services/habit_service.dart';
import 'package:intl/intl.dart';
import 'notification_screen.dart';

class AddHabitScreen extends StatefulWidget {
  final Habit? habit; // Nếu có, sẽ là chế độ chỉnh sửa
  
  const AddHabitScreen({Key? key, this.habit}) : super(key: key);

  @override
  State<AddHabitScreen> createState() => _AddHabitScreenState();
}

class _AddHabitScreenState extends State<AddHabitScreen> {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController goalController = TextEditingController();
  
  // Biến để lưu icon được chọn
  int selectedIconIndex = 0;
  
  // Biến để lưu danh mục được chọn
  String selectedCategory = 'health';
  
  // Biến để lưu đơn vị được chọn
  String selectedUnit = 'Ly';
  
  // Biến để lưu tần suất được chọn
  String selectedFrequency = 'Hằng ngày';
  
  // Danh sách thời gian nhắc nhở
  List<String> reminderTimes = [];
  
  // Danh sách icons
  final List<IconData> habitIcons = [
    Icons.water_drop,
    Icons.self_improvement,
    Icons.spa,
    Icons.menu_book,
    Icons.fitness_center,
    Icons.sports_soccer,
    Icons.code,
    Icons.music_note,
  ];
  
  // Danh sách đơn vị
  final List<String> units = ['Ly', 'Lần', 'Phút', 'Giờ', 'Buổi'];
  
  // Danh sách tần suất
  final List<String> frequencies = ['Hằng ngày', 'Hàng tuần', 'Hàng tháng', 'Tùy chỉnh'];
  
  // Danh sách danh mục
  late List<HabitCategory> categories;
  
  // Service để giao tiếp với API
  late HabitService habitService;
  
  // Trạng thái đang tải
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    
    // Khởi tạo service với địa chỉ IP của máy tính
    habitService = HabitService(baseUrl: 'http://192.168.1.12:3000');
    
    // Khởi tạo danh sách danh mục
    categories = getDefaultCategories();
    
    // Nếu là chế độ chỉnh sửa, điền thông tin từ habit
    if (widget.habit != null) {
      nameController.text = widget.habit!.name;
      goalController.text = widget.habit!.target.toString();
      selectedIconIndex = widget.habit!.iconIndex;
      selectedCategory = widget.habit!.category;
      selectedUnit = widget.habit!.unit;
      selectedFrequency = widget.habit!.frequency;
      
      // Parse thời gian nhắc nhở từ chuỗi
      if (widget.habit!.reminders.isNotEmpty) {
        reminderTimes = widget.habit!.reminders.split(', ').where((time) => time.isNotEmpty).toList();
      }
    } else {
      // Giá trị mặc định cho thói quen mới
      nameController.text = 'Uống nước';
      goalController.text = '8';
      reminderTimes = ['8:00', '12:00', '16:00', '20:00'];
    }
  }

  @override
  void dispose() {
    nameController.dispose();
    goalController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: Text(
          widget.habit != null ? 'Chỉnh sửa thói quen' : 'Tạo thói quen mới',
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 18,
            color: Colors.black,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.blue),
          onPressed: () => Navigator.pop(context),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
      ),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Tên thói quen
                const Text(
                  'Tên thói quen',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    color: Colors.grey[200],
                  ),
                  child: TextField(
                    controller: nameController,
                    decoration: const InputDecoration(
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    ),
                    style: const TextStyle(fontSize: 16),
                  ),
                ),

                const SizedBox(height: 24),

                // Danh mục
                const Text(
                  'Danh mục',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    color: Colors.grey[200],
                  ),
                  child: DropdownButtonFormField<String>(
                    value: selectedCategory,
                    decoration: const InputDecoration(
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                    ),
                    items: categories.map((category) {
                      return DropdownMenuItem<String>(
                        value: category.id,
                        child: Text(category.name),
                      );
                    }).toList(),
                    onChanged: (value) {
                      setState(() {
                        selectedCategory = value!;
                      });
                    },
                  ),
                ),

                const SizedBox(height: 24),

                // Biểu tượng
                const Text(
                  'Biểu tượng',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 8),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      ...List.generate(habitIcons.length, (index) {
                        return Padding(
                          padding: EdgeInsets.only(right: index < habitIcons.length - 1 ? 12 : 0),
                          child: GestureDetector(
                            onTap: () {
                              setState(() {
                                selectedIconIndex = index;
                              });
                            },
                            child: Container(
                              width: 60,
                              height: 60,
                              decoration: BoxDecoration(
                                color: selectedIconIndex == index 
                                    ? Colors.blue[100] 
                                    : Colors.grey[200],
                                shape: BoxShape.circle,
                                border: selectedIconIndex == index
                                    ? Border.all(color: Colors.blue, width: 2)
                                    : null,
                              ),
                              child: Icon(
                                habitIcons[index],
                                size: 28,
                                color: selectedIconIndex == index 
                                    ? Colors.blue 
                                    : Colors.grey[600],
                              ),
                            ),
                          ),
                        );
                      }),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Mục tiêu
                const Text(
                  'Mục tiêu',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      flex: 2,
                      child: Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                          color: Colors.grey[200],
                        ),
                        child: TextField(
                          controller: goalController,
                          keyboardType: TextInputType.number,
                          decoration: const InputDecoration(
                            border: InputBorder.none,
                            contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          ),
                          style: const TextStyle(fontSize: 16),
                          onChanged: (value) {
                            _validateGoalInput(value);
                          },
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      flex: 1,
                      child: Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                          color: Colors.grey[200],
                        ),
                        child: DropdownButtonFormField<String>(
                          value: selectedUnit,
                          decoration: const InputDecoration(
                            border: InputBorder.none,
                            contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                          ),
                          items: units.map((unit) {
                            return DropdownMenuItem<String>(
                              value: unit,
                              child: Text(unit),
                            );
                          }).toList(),
                          onChanged: (value) {
                            setState(() {
                              selectedUnit = value!;
                            });
                          },
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 24),

                // Tần suất
                const Text(
                  'Tần suất',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 8),
                GestureDetector(
                  onTap: () {
                    _showFrequencyDialog();
                  },
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      color: Colors.grey[200],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          selectedFrequency,
                          style: const TextStyle(fontSize: 16),
                        ),
                        const Icon(Icons.keyboard_arrow_down, color: Colors.grey),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Thông báo nhắc nhở
                const Text(
                  'Thông báo nhắc nhở',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 8),
                GestureDetector(
                  onTap: () async {
                    final result = await Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => NotificationScreen(
                          habitName: nameController.text.isNotEmpty ? nameController.text : 'Thói quen',
                          initialTimes: reminderTimes,
                        ),
                      ),
                    );
                    
                    if (result != null && result is List<String>) {
                      setState(() {
                        reminderTimes = result;
                      });
                    }
                  },
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      color: Colors.grey[200],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                reminderTimes.isEmpty 
                                    ? 'Chưa có thông báo' 
                                    : '${reminderTimes.length} thông báo',
                                style: const TextStyle(fontSize: 16),
                              ),
                              if (reminderTimes.isNotEmpty) ...[
                                const SizedBox(height: 4),
                                Text(
                                  reminderTimes.join(', '),
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.grey[600],
                                  ),
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ],
                          ),
                        ),
                        const Icon(Icons.notifications_outlined, color: Colors.blue),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 40),

                // Buttons
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {
                          _handleCancel();
                        },
                        style: OutlinedButton.styleFrom(
                          backgroundColor: Colors.grey[200],
                          side: BorderSide.none,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          padding: const EdgeInsets.symmetric(vertical: 14),
                        ),
                        child: const Text(
                          'Hủy',
                          style: TextStyle(
                            color: Colors.black87,
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: isLoading ? null : _saveHabit,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          elevation: 0,
                        ),
                        child: Text(
                          isLoading ? 'Đang lưu...' : 'Lưu',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          
          // Hiển thị loading indicator
          if (isLoading)
            Container(
              color: Colors.black.withOpacity(0.3),
              child: const Center(
                child: CircularProgressIndicator(),
              ),
            ),
        ],
      ),
    );
  }

  // Hiển thị dialog chọn tần suất
  void _showFrequencyDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Chọn tần suất'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: frequencies.map((frequency) {
              return ListTile(
                title: Text(frequency),
                onTap: () {
                  setState(() {
                    selectedFrequency = frequency;
                  });
                  Navigator.pop(context);
                },
              );
            }).toList(),
          ),
        );
      },
    );
  }

  // Validate input mục tiêu
  void _validateGoalInput(String value) {
    if (value.isEmpty) {
      return;
    }
    
    final goal = int.tryParse(value);
    if (goal == null || goal <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Mục tiêu phải là số dương')),
      );
    }
  }

  // Xử lý hủy
  void _handleCancel() {
    bool hasChanges = false;
    
    if (widget.habit != null) {
      hasChanges = nameController.text != widget.habit!.name ||
          goalController.text != widget.habit!.target.toString() ||
          selectedIconIndex != widget.habit!.iconIndex ||
          selectedCategory != widget.habit!.category ||
          selectedUnit != widget.habit!.unit ||
          selectedFrequency != widget.habit!.frequency ||
          reminderTimes.join(', ') != widget.habit!.reminders;
    } else {
      hasChanges = nameController.text != 'Uống nước' ||
          goalController.text != '8' ||
          selectedIconIndex != 0 ||
          selectedCategory != 'health' ||
          selectedUnit != 'Ly' ||
          selectedFrequency != 'Hằng ngày' ||
          reminderTimes.join(', ') != '8:00, 12:00, 16:00, 20:00';
    }
    
    if (hasChanges) {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text('Xác nhận'),
            content: const Text('Bạn có chắc muốn hủy? Các thay đổi sẽ không được lưu.'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Tiếp tục chỉnh sửa'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                  Navigator.pop(context);
                },
                child: const Text('Hủy'),
              ),
            ],
          );
        },
      );
    } else {
      Navigator.pop(context);
    }
  }

  // Xử lý lưu thói quen
  Future<void> _saveHabit() async {
    if (nameController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng nhập tên thói quen')),
      );
      return;
    }

    final goal = int.tryParse(goalController.text);
    if (goal == null || goal <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Mục tiêu phải là số dương')),
      );
      return;
    }

    setState(() {
      isLoading = true;
    });

    try {
      Habit habitData;
      
      if (widget.habit != null) {
        habitData = Habit(
          id: widget.habit!.id,
          name: nameController.text.trim(),
          category: selectedCategory,
          iconIndex: selectedIconIndex,
          target: goal,
          unit: selectedUnit,
          frequency: selectedFrequency,
          reminders: reminderTimes.join(', '),
          color: _getCategoryColor(selectedCategory),
          createdAt: widget.habit!.createdAt,
          updatedAt: DateTime.now().toIso8601String(),
        );
      } else {
        habitData = Habit(
          id: '',
          name: nameController.text.trim(),
          category: selectedCategory,
          iconIndex: selectedIconIndex,
          target: goal,
          unit: selectedUnit,
          frequency: selectedFrequency,
          reminders: reminderTimes.join(', '),
          color: _getCategoryColor(selectedCategory),
          createdAt: DateTime.now().toIso8601String(),
          updatedAt: DateTime.now().toIso8601String(),
        );
      }

      Habit savedHabit;
      if (widget.habit != null) {
        savedHabit = await habitService.updateHabit(habitData);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Đã cập nhật thói quen thành công!')),
        );
      } else {
        savedHabit = await habitService.createHabit(habitData);
        
        if (savedHabit.id.isEmpty) {
          throw Exception("Server không trả về ID hợp lệ");
        }
        
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Đã tạo thói quen thành công! ID: ${savedHabit.id}')),
        );
        
        try {
          final today = DateTime.now();
          
          if (savedHabit.id.isNotEmpty) {
            await habitService.updateProgress(
              savedHabit.id,
              today,
              0,
            );
          }
        } catch (e) {
          print('Lỗi khi tạo tiến độ ban đầu: $e');
        }
      }

      setState(() {
        isLoading = false;
      });

      Navigator.pop(context, true);
    } catch (e) {
      setState(() {
        isLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi: $e')),
      );
    }
  }

  // Lấy màu dựa trên danh mục
  String _getCategoryColor(String categoryId) {
    final category = categories.firstWhere(
      (c) => c.id == categoryId,
      orElse: () => HabitCategory(id: 'default', name: 'Default', color: 'grey'),
    );
    return category.color;
  }
}
