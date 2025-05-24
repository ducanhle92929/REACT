// Mô hình dữ liệu cho thói quen
class Habit {
  final String id;
  final String name;
  final String category;
  final int iconIndex;
  final int target;
  final String unit;
  final String frequency;
  final String reminders;
  final String color;
  final String createdAt;
  final String? updatedAt;

  Habit({
    required this.id,
    required this.name,
    required this.category,
    required this.iconIndex,
    required this.target,
    required this.unit,
    required this.frequency,
    required this.reminders,
    required this.color,
    required this.createdAt,
    this.updatedAt,
  });

  // Chuyển đổi từ JSON sang đối tượng Habit
  factory Habit.fromJson(Map<String, dynamic> json) {
    // Đảm bảo ID không null và không rỗng
    final id = json['id'] ?? '';
    
    // In ra ID để debug
    print('Parsing Habit from JSON with ID: $id');
    
    return Habit(
      id: id,
      name: json['name'] ?? '',
      category: json['category'] ?? '',
      iconIndex: json['iconIndex'] ?? 0,
      target: json['target'] ?? 0,
      unit: json['unit'] ?? '',
      frequency: json['frequency'] ?? '',
      reminders: json['reminders'] ?? '',
      color: json['color'] ?? '',
      createdAt: json['createdAt'] ?? DateTime.now().toIso8601String(),
      updatedAt: json['updatedAt'],
    );
  }

  // Chuyển đổi từ đối tượng Habit sang JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'iconIndex': iconIndex,
      'target': target,
      'unit': unit,
      'frequency': frequency,
      'reminders': reminders,
      'color': color,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }

  // Tạo bản sao của đối tượng Habit với các thuộc tính mới
  Habit copyWith({
    String? id,
    String? name,
    String? category,
    int? iconIndex,
    int? target,
    String? unit,
    String? frequency,
    String? reminders,
    String? color,
    String? createdAt,
    String? updatedAt,
  }) {
    return Habit(
      id: id ?? this.id,
      name: name ?? this.name,
      category: category ?? this.category,
      iconIndex: iconIndex ?? this.iconIndex,
      target: target ?? this.target,
      unit: unit ?? this.unit,
      frequency: frequency ?? this.frequency,
      reminders: reminders ?? this.reminders,
      color: color ?? this.color,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

// Mô hình dữ liệu cho tiến độ thói quen
class HabitProgress {
  final String id;
  final String habitId;
  final String date;
  final int value;
  final String updatedAt;

  HabitProgress({
    required this.id,
    required this.habitId,
    required this.date,
    required this.value,
    required this.updatedAt,
  });

  // Chuyển đổi từ JSON sang đối tượng HabitProgress
  factory HabitProgress.fromJson(Map<String, dynamic> json) {
    return HabitProgress(
      id: json['id'] ?? '',
      habitId: json['habitId'] ?? '',
      date: json['date'] ?? '',
      value: json['value'] ?? 0,
      updatedAt: json['updatedAt'] ?? DateTime.now().toIso8601String(),
    );
  }

  // Chuyển đổi từ đối tượng HabitProgress sang JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'habitId': habitId,
      'date': date,
      'value': value,
      'updatedAt': updatedAt,
    };
  }
}

// Mô hình dữ liệu cho danh mục thói quen
class HabitCategory {
  final String id;
  final String name;
  final String color;

  HabitCategory({
    required this.id,
    required this.name,
    required this.color,
  });

  // Chuyển đổi từ JSON sang đối tượng HabitCategory
  factory HabitCategory.fromJson(Map<String, dynamic> json) {
    return HabitCategory(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      color: json['color'] ?? '',
    );
  }

  // Chuyển đổi từ đối tượng HabitCategory sang JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'color': color,
    };
  }
}

// Danh sách các danh mục mặc định
List<HabitCategory> getDefaultCategories() {
  return [
    HabitCategory(
      id: 'health',
      name: 'Sức Khỏe',
      color: 'blue',
    ),
    HabitCategory(
      id: 'mental',
      name: 'Tinh Thần',
      color: 'orange',
    ),
    HabitCategory(
      id: 'productivity',
      name: 'Năng Suất',
      color: 'green',
    ),
  ];
}
