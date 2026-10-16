// src/screens/BookingScreen.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { randomUUID } from "expo-crypto";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { createBooking } from "../../api/bookings";
import { phoneLink } from "../../utils/contact";
import { getServices } from "../../api/services";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";

/* =========================
   Data & Helpers
========================= */
const SERVICE_PRESENTATION = {
  cleaning: {
    name: "Dọn Dẹp Tổng Quát",
    price: 70000,
    icon: "🧽",
    minHours: 1,
  },
  cooking: {
    name: "Nấu Ăn & Rửa Bát",
    price: 90000,
    icon: "👩‍🍳",
    minHours: 1,
  },
  laundry: { name: "Giặt Ủi Quần Áo", price: 70000, icon: "👕", minHours: 1 },
  childcare: {
    name: "Chăm Sóc Trẻ Em",
    price: 100000,
    icon: "👶",
    minHours: 1,
  },
};

const toDateStr = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const TODAY_STR = toDateStr(new Date());

/* =========================
   Progress Steps
========================= */
function ProgressSteps({ currentStep = 1 }) {
  const steps = [
    { id: 1, name: "Chọn dịch vụ" },
    { id: 2, name: "Chọn thời gian" },
    { id: 3, name: "Thông tin" },
    { id: 4, name: "Xác nhận" },
  ];
  return (
    <View style={styles.progressWrap}>
      {steps.map((s, idx) => {
        const passed = s.id < currentStep;
        const active = s.id === currentStep;
        return (
          <View key={s.id} style={styles.progressItem}>
            <View
              style={[
                styles.progressDot,
                passed && { backgroundColor: "#10b981" },
                active && {
                  backgroundColor: "#10b981",
                  borderWidth: 2,
                  borderColor: "#34d399",
                },
              ]}
            >
              <Text style={[styles.progressNum, { color: "#fff" }]}>
                {s.id}
              </Text>
            </View>
            <Text
              style={[
                styles.progressText,
                (passed || active) && { color: "#065f46" },
              ]}
            >
              {s.name}
            </Text>
            {idx < steps.length - 1 && <View style={styles.progressLine} />}
          </View>
        );
      })}
    </View>
  );
}

/* =========================
   Step 1: Chọn dịch vụ
========================= */
function ServiceCard({ k, data, selected, onSelect }) {
  const desc =
    k === "cleaning"
      ? "Vệ sinh toàn bộ nhà cửa, lau chùi, hút bụi, sắp xếp đồ"
      : k === "cooking"
      ? "Chuẩn bị bữa ăn theo yêu cầu, rửa bát đĩa, dọn bếp"
      : k === "laundry"
      ? "Giặt giũ, phơi khô, ủi là và sắp xếp quần áo"
      : "Trông trẻ, cho ăn, vui chơi và hoạt động phù hợp";

  return (
    <Pressable
      onPress={() => onSelect(k)}
      style={[
        styles.card,
        selected === k && {
          borderColor: "#10b981",
          backgroundColor: "#ecfdf5",
        },
      ]}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={styles.cardIcon}>
          <Text style={{ fontSize: 22 }}>{data.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{data.name}</Text>
          <Text style={styles.cardDesc}>{desc}</Text>
          <View style={styles.cardBottomRow}>
            <Text style={styles.cardPrice}>
              {data.price.toLocaleString("vi-VN")}đ/giờ
            </Text>
            <Text style={styles.cardPill}>Tối thiểu {data.minHours} giờ</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function StepService({ selected, setSelected, onNext, services }) {
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.h1}>Chọn dịch vụ</Text>
        <Text style={styles.muted}>
          Lựa chọn dịch vụ phù hợp với nhu cầu của bạn
        </Text>
      </View>

      <View style={{ rowGap: 12 }}>
        {Object.entries(services).map(([k, v]) => (
          <ServiceCard
            key={k}
            k={k}
            data={v}
            selected={selected}
            onSelect={setSelected}
          />
        ))}
      </View>

      <View style={styles.actionsCenter}>
        <TouchableOpacity
          onPress={onNext}
          disabled={!selected}
          style={[styles.btnPrimary, !selected && styles.btnDisabled]}
          activeOpacity={0.9}
        >
          <Text style={styles.btnPrimaryText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

/* =========================
   Step 2: Calendar + Time + Duration
========================= */
function Calendar({ selectedDate, onDateSelect }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const days = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0=CN
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const arr = [];

    for (let i = 0; i < firstDay; i++) arr.push(null);

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(currentYear, currentMonth, d);
      const dateStr = toDateStr(dateObj);
      const isToday = dateStr === TODAY_STR;
      const isPast =
        dateObj <
        new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isSelected = selectedDate === dateStr;
      arr.push({ d, dateStr, isToday, isPast, isSelected });
    }
    const rem = arr.length % 7;
    if (rem) for (let i = 0; i < 7 - rem; i++) arr.push(null);
    return arr;
  }, [currentMonth, currentYear, selectedDate]);

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };

  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Chọn ngày</Text>

      <View style={styles.calHeader}>
        <TouchableOpacity onPress={previousMonth} style={styles.iconBtn}>
          <Text style={{ fontSize: 16 }}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.calMonth}>
          {monthNames[currentMonth]}, {currentYear}
        </Text>
        <TouchableOpacity onPress={nextMonth} style={styles.iconBtn}>
          <Text style={{ fontSize: 16 }}>▶</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekRow}>
        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((w) => (
          <Text key={w} style={styles.weekCell}>
            {w}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((cell, idx) => {
          if (!cell) return <View key={`e-${idx}`} style={styles.dayCell} />;
          const { d, dateStr, isToday, isPast, isSelected } = cell;
          let cellStyle = [styles.dayCellInner];
          if (isPast) cellStyle.push({ opacity: 0.45 });
          if (isSelected) cellStyle.push({ backgroundColor: "#10b981" });
          if (isToday && !isSelected)
            cellStyle.push({ borderWidth: 1.5, borderColor: "#f59e0b" });

          return (
            <Pressable
              key={dateStr}
              style={[styles.dayCell]}
              onPress={!isPast ? () => onDateSelect(dateStr) : undefined}
            >
              <View style={cellStyle}>
                <Text style={[styles.dayText, isSelected && { color: "#fff" }]}>
                  {d}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function TimeAndDuration({
  service,
  duration,
  setDuration,
  selectedDate,
  selectedTime,
  setSelectedTime,
  totalPrice,
}) {
  const minHours = service?.minHours ?? 2;

  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, date) => {
    setShowPicker(false);
    if (date) {
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      setSelectedTime(`${hh}:${mm}`);
    }
  };

  const minTime = useMemo(() => {
    if (!selectedDate) return "00:00";
    if (selectedDate !== TODAY_STR) return "00:00";
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }, [selectedDate]);

  const adjust = (delta) => {
    const v = Number((duration + delta).toFixed(1));
    if (v >= minHours && v <= (service?.maxHours ?? 8)) setDuration(v);
  };

  const isTimeValid = useMemo(() => {
    if (!selectedDate || !selectedTime) return false;
    if (selectedDate !== TODAY_STR) return true;
    const [hh, mm] = selectedTime.split(":").map(Number);
    const chosen = new Date(
      `${selectedDate}T${String(hh).padStart(2, "0")}:${String(mm).padStart(
        2,
        "0"
      )}:00`
    );
    return chosen.getTime() >= Date.now();
  }, [selectedDate, selectedTime]);

  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Chọn giờ & thời lượng</Text>

      <Text style={styles.panelTitle}>Chọn giờ & thời lượng</Text>

      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={styles.input}
      >
        <Text>{selectedTime || "Chọn giờ bắt đầu"}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          mode="time"
          value={new Date()}
          is24Hour
          display="spinner"
          onChange={onChange}
        />
      )}
      <Text style={styles.hint}>
        Bạn có thể chọn bất kỳ thời điểm nào trong ngày (độ phân giải 1 phút).
        Tối thiểu: {minTime}
      </Text>

      {!isTimeValid && selectedTime && selectedDate === TODAY_STR && (
        <View style={styles.warnBox}>
          <Text style={styles.warnText}>
            Giờ bạn chọn đã qua so với hiện tại. Vui lòng chọn giờ lớn hơn.
          </Text>
        </View>
      )}

      <View style={{ marginTop: 16 }}>
        <Text style={styles.subTitle}>Thời gian làm việc</Text>
        <View style={styles.durationRow}>
          <TouchableOpacity
            onPress={() => adjust(-1)}
            style={styles.roundBtn}
          >
            <Text style={styles.roundBtnText}>-</Text>
          </TouchableOpacity>

          <View style={{ alignItems: "center", flex: 1 }}>
            <Text style={styles.bigNumber}>{duration.toFixed(1)}</Text>
            <Text style={styles.muted}>giờ (tối thiểu {minHours} giờ)</Text>
          </View>

          <TouchableOpacity onPress={() => adjust(1)} style={styles.roundBtn}>
            <Text style={styles.roundBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center", marginTop: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            Tổng tiền:{" "}
            <Text style={{ color: "#059669" }}>
              {totalPrice.toLocaleString("vi-VN")}đ
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

function StepTime({
  service,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  duration,
  setDuration,
  onNext,
  onBack,
  totalPrice,
}) {
  const canNext =
    selectedDate &&
    selectedTime &&
    (selectedDate !== TODAY_STR ||
      (() => {
        const [hh, mm] = selectedTime.split(":").map(Number);
        const chosen = new Date(
          `${selectedDate}T${String(hh).padStart(2, "0")}:${String(mm).padStart(
            2,
            "0"
          )}:00`
        );
        return chosen.getTime() >= Date.now();
      })());

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.h1}>Chọn thời gian</Text>
        <Text style={styles.muted}>
          Lựa chọn ngày & giờ phù hợp với lịch trình của bạn
        </Text>
        {service && (
          <Text style={[styles.muted, { marginTop: 6 }]}>
            Dịch vụ:{" "}
            <Text style={{ fontWeight: "600", color: "#111827" }}>
              {service.name}
            </Text>{" "}
            • Giá: {service.price.toLocaleString("vi-VN")}đ/giờ • Tối thiểu{" "}
            {service.minHours}h
          </Text>
        )}
      </View>

      <View style={styles.twoCols}>
        <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        <TimeAndDuration
          service={service}
          duration={duration}
          setDuration={setDuration}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          totalPrice={totalPrice}
        />
      </View>

      <View style={styles.actionsBetween}>
        <TouchableOpacity onPress={onBack} style={styles.btnGray}>
          <Text style={styles.btnGrayText}>Quay lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onNext}
          disabled={!canNext}
          style={[styles.btnPrimary, !canNext && styles.btnDisabled]}
          activeOpacity={0.9}
        >
          <Text style={styles.btnPrimaryText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

/* =========================
   Step 3: Customer Info + Summary
========================= */
function Row({ label, value, className }) {
  return (
    <View style={[styles.rowBetween, className]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function StepCustomer({
  customerInfo,
  setCustomerInfo,
  onNext,
  onBack,
  pricing,
}) {
  const setField = (k, v) => setCustomerInfo((p) => ({ ...p, [k]: v }));
  const { name, phone, email: rawEmail, address } = customerInfo;

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const email = customerInfo.email.trim();

  const validateAndNext = () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert(
        "Thiếu thông tin",
        "Vui lòng nhập Họ tên, Số điện thoại và Địa chỉ"
      );
      return;
    }
    if (!phoneLink(phone) || phone.length > 40) {
      Alert.alert(
        "Số điện thoại không hợp lệ",
        "Số điện thoại liên hệ phải có từ 6 đến 15 chữ số."
      );
      return;
    }
    if (email && !emailRegex.test(email)) {
      Alert.alert("Email không hợp lệ", "Vui lòng nhập đúng định dạng email");
      return;
    }
    onNext(); // hợp lệ thì mới qua bước tiếp theo
  };

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.h1}>Thông tin khách hàng</Text>
        <Text style={styles.muted}>
          Vui lòng cung cấp thông tin để chúng tôi liên lạc và phục vụ
        </Text>
      </View>

      <View style={styles.twoCols}>
        <View style={styles.panel}>
          <View style={{ rowGap: 12 }}>
            <View style={styles.row2}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Họ và tên *</Text>
                <TextInput
                  value={customerInfo.name}
                  onChangeText={(t) => setField("name", t)}
                  placeholder="Nhập họ và tên"
                  style={styles.input}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.label}>Số điện thoại *</Text>
                <TextInput
                  value={customerInfo.phone}
                  onChangeText={(t) => setField("phone", t)}
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                  style={styles.input}
                />
              </View>
            </View>

            <View>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={customerInfo.email}
                onChangeText={(t) => setField("email", t)}
                placeholder="Nhập email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <View>
              <Text style={styles.label}>Địa chỉ *</Text>
              <TextInput
                value={customerInfo.address}
                onChangeText={(t) => setField("address", t)}
                placeholder="Số nhà, đường, phường/xã, quận/huyện"
                style={[
                  styles.input,
                  { height: 86, textAlignVertical: "top", paddingTop: 10 },
                ]}
                multiline
              />
            </View>

            <View>
              <Text style={styles.label}>Ghi chú đặc biệt</Text>
              <TextInput
                value={customerInfo.notes}
                onChangeText={(t) => setField("notes", t)}
                placeholder="Yêu cầu đặc biệt, hướng dẫn đến địa chỉ, thú cưng..."
                style={[
                  styles.input,
                  { height: 86, textAlignVertical: "top", paddingTop: 10 },
                ]}
                multiline
              />
            </View>

            <View style={styles.payBox}>
              <Text style={styles.payTitle}>Phương thức thanh toán</Text>
              <Text style={styles.payText}>Tiền mặt trực tiếp cho cleaner sau khi hoàn thành ca.</Text>
              <Text>CleanMate chỉ kết nối dịch vụ, không thu hoặc giữ tiền.</Text>
            </View>
          </View>
        </View>

        <View style={[styles.panel, { height: "auto" }]}>
          <Text style={styles.panelTitle}>Tóm tắt đơn hàng</Text>
          <View style={{ rowGap: 8 }}>
            <Row label="Dịch vụ" value={pricing.serviceName} />
            <Row label="Ngày" value={pricing.date} />
            <Row label="Giờ bắt đầu" value={pricing.time} />
            <Row label="Thời lượng" value={`${pricing.duration} giờ`} />
            <Row
              label="Tạm tính"
              value={`${pricing.subtotal.toLocaleString("vi-VN")}đ`}
            />
            {pricing.discount > 0 && (
              <Row
                label="Giảm giá"
                value={`- ${pricing.discount.toLocaleString("vi-VN")}đ`}
              />
            )}
            <View style={styles.divider} />
            <View style={styles.rowBetween}>
              <Text style={{ fontWeight: "700", color: "#111827" }}>
                Tổng cộng
              </Text>
              <Text
                style={{ fontSize: 18, fontWeight: "800", color: "#059669" }}
              >
                {pricing.total.toLocaleString("vi-VN")}đ
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actionsBetween}>
        <TouchableOpacity onPress={onBack} style={styles.btnGray}>
          <Text style={styles.btnGrayText}>Quay lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={validateAndNext}
          style={styles.btnPrimary}
          activeOpacity={0.9}
        >
          <Text style={styles.btnPrimaryText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

/* =========================
   Step 4: Confirm
========================= */
function formatDateVN(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function StepConfirm({
  service,
  date,
  time,
  duration,
  customer,
  pricing,
  onBack,
  onConfirm,
  submitting,
}) {
  if (!service || !customer) return null;
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.h1}>Xác nhận đặt lịch</Text>
        <Text style={styles.muted}>
          Vui lòng kiểm tra lại thông tin trước khi xác nhận
        </Text>
      </View>

      <View style={styles.panel}>
        <View style={{ rowGap: 16 }}>
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Thông tin dịch vụ</Text>
            <View style={styles.row2}>
              <View style={styles.serviceRow}>
                <View style={styles.cardIcon}>
                  <Text style={{ fontSize: 20 }}>{service.icon}</Text>
                </View>
                <View>
                  <Text style={{ fontWeight: "600", color: "#111827" }}>
                    {service.name}
                  </Text>
                  <Text style={{ color: "#059669" }}>
                    {service.price.toLocaleString("vi-VN")}đ/giờ
                  </Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.kv}>
                  Ngày: <Text style={styles.kvV}>{formatDateVN(date)}</Text>
                </Text>
                <Text style={styles.kv}>
                  Giờ: <Text style={styles.kvV}>{time}</Text>
                </Text>
                <Text style={styles.kv}>
                  Thời lượng: <Text style={styles.kvV}>{duration} giờ</Text>
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>Thông tin khách hàng</Text>
            <View style={styles.row2}>
              <View style={{ flex: 1 }}>
                <Text style={styles.kv}>
                  Họ tên: <Text style={styles.kvV}>{customer.name}</Text>
                </Text>
                <Text style={styles.kv}>
                  Điện thoại: <Text style={styles.kvV}>{customer.phone}</Text>
                </Text>
                <Text style={styles.kv}>
                  Email:{" "}
                  <Text style={styles.kvV}>{customer.email || "Không có"}</Text>
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.kv}>
                  Địa chỉ: <Text style={styles.kvV}>{customer.address}</Text>
                </Text>
                <Text style={styles.kv}>
                  Thanh toán:{" "}
                  <Text style={styles.kvV}>
                    Tiền mặt trực tiếp cho cleaner sau khi hoàn thành ca
                  </Text>
                </Text>
                {!!customer.notes?.trim() && (
                  <Text style={styles.kv}>
                    Ghi chú: <Text style={styles.kvV}>{customer.notes}</Text>
                  </Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>Chi tiết thanh toán</Text>
            <View style={styles.payDetail}>
              <View style={styles.rowBetween}>
                <Text style={styles.rowLabel}>Tạm tính:</Text>
                <Text style={styles.rowValue}>
                  {pricing.subtotal.toLocaleString("vi-VN")}đ
                </Text>
              </View>
              {pricing.discount > 0 && (
                <View style={styles.rowBetween}>
                  <Text style={[styles.rowLabel, { color: "#065f46" }]}>
                    Giảm giá:
                  </Text>
                  <Text style={[styles.rowValue, { color: "#065f46" }]}>
                    -{pricing.discount.toLocaleString("vi-VN")}đ
                  </Text>
                </View>
              )}
              <View style={styles.divider} />
              <View style={styles.rowBetween}>
                <Text
                  style={{ fontSize: 16, fontWeight: "700", color: "#111827" }}
                >
                  Tổng cộng:
                </Text>
                <Text
                  style={{ fontSize: 22, fontWeight: "800", color: "#059669" }}
                >
                  {pricing.total.toLocaleString("vi-VN")}đ
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actionsBetween}>
            <TouchableOpacity onPress={onBack} disabled={submitting} style={styles.btnGray}>
              <Text style={styles.btnGrayText}>Quay lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              disabled={submitting}
              style={[styles.btnPrimary, submitting && styles.btnDisabled]}
              activeOpacity={0.9}
            >
              <Text style={styles.btnPrimaryText}>{submitting ? "Đang đặt lịch..." : "Xác nhận đặt lịch"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

/* =========================
   Success
========================= */
function Success({ code, onNew, onHome }) {
  return (
    <View style={{ padding: 16 }}>
      <View style={styles.panelCenter}>
        <Text style={{ fontSize: 48, marginBottom: 12 }}>✅</Text>
        <Text style={styles.h1}>Đặt lịch thành công!</Text>
        <Text style={[styles.muted, { textAlign: "center", marginTop: 8 }]}>
          Cảm ơn bạn đã tin tưởng CleanMate. Chúng tôi sẽ liên hệ sớm để xác
          nhận chi tiết.
        </Text>

        <View style={styles.successBox}>
          <Text
            style={{ fontWeight: "700", color: "#065f46", marginBottom: 6 }}
          >
            Mã đặt lịch của bạn:
          </Text>
          <Text style={styles.successCode}>{code}</Text>
        </View>

        <TouchableOpacity
          onPress={onNew}
          style={styles.btnPrimary}
          activeOpacity={0.9}
        >
          <Text style={styles.btnPrimaryText}>Đặt lịch mới</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onHome}
          style={[styles.btnGray, { marginTop: 10 }]}
        >
          <Text style={styles.btnGrayText}>Về trang chủ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* =========================
   MAIN
========================= */
export default function BookingScreen() {
  const [services, setServices] = useState(null);
  const [error, setError] = useState("");
  const load = () => { setError(""); getServices().then(data => setServices(Object.fromEntries(data.map(s => [s.key, {
    ...SERVICE_PRESENTATION[s.key], name: s.name, price: s.hourlyRate, minHours: s.minHours, maxHours: s.maxHours,
  }])))).catch(() => setError("Không thể tải dịch vụ và giá. Vui lòng thử lại.")); };
  useEffect(() => { load(); }, []);
  if (error) return <View style={{ padding: 20 }}><Text>{error}</Text><TouchableOpacity onPress={load}><Text>Thử lại</Text></TouchableOpacity></View>;
  if (!services) return <Text>Đang tải dịch vụ...</Text>;
  if (!Object.keys(services).length) return <Text>Hiện chưa có dịch vụ mở đặt lịch.</Text>;
  return <BookingFlow services={services} />;
}

function BookingFlow({ services: SERVICES }) {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedKey, setSelectedKey] = useState(null);
  const service = selectedKey ? SERVICES[selectedKey] : null;

  const [selectedDate, setSelectedDate] = useState(TODAY_STR);
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState(service?.minHours ?? 2);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    paymentMethod: "cash",
  });

  const subtotal = useMemo(
    () => (service ? service.price * duration : 0),
    [service, duration]
  );
  const discount = 0;
  const total = useMemo(
    () => Math.max(0, subtotal - discount),
    [subtotal, discount]
  );

  const [successCode, setSuccessCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const sending = useRef(false);
  const bookingAttempt = useRef(null);

  const goNext = () => setCurrentStep((s) => Math.min(4, s + 1));
  const goBack = () => setCurrentStep((s) => Math.max(1, s - 1));

  const onServiceNext = () => {
    if (!selectedKey) return;
    setDuration(SERVICES[selectedKey].minHours);
    goNext();
  };

  const onTimeNext = () => {
    if (!selectedDate || !selectedTime) return;
    goNext();
  };

  const onCustomerNext = () => {
    const { name, phone, address } = customerInfo;
    if (!name.trim() || !phone.trim() || !address.trim()) return;
    goNext();
  };

  const onConfirm = async () => {
    if (sending.current) return;
    sending.current = true;
    setSubmitting(true);
    try {
      const payload = {
        ServiceKey: selectedKey,
        StartTime: new Date(`${selectedDate}T${selectedTime}:00`).toISOString(),
        DurationHours: duration,
        Address: customerInfo.address,
        ContactName: customerInfo.name,
        ContactPhone: customerInfo.phone,
        Notes: customerInfo.notes,
        PaymentMethod: "cash",
        ExpectedPrice: total,
      };
      const signature = JSON.stringify(payload);
      if (bookingAttempt.current?.signature !== signature)
        bookingAttempt.current = { signature, requestId: randomUUID() };
      const res = await createBooking({ ...payload, RequestId: bookingAttempt.current.requestId });
      setSuccessCode("CM" + String(res.id).padStart(6, "0"));
      setCurrentStep(99);
    } catch (err) {
      Alert.alert("Đặt lịch thất bại", err?.response?.data?.message || "Thử lại sau");
    } finally { sending.current = false; setSubmitting(false); }
  };

  const resetAll = () => {
    bookingAttempt.current = null;
    setCurrentStep(1);
    setSelectedKey(null);
    setSelectedDate(TODAY_STR);
    setSelectedTime("");
    setDuration(2);
    setCustomerInfo({
      name: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
      paymentMethod: "cash",
    });
    setSuccessCode("");
  };

  const pricingSummary = {
    serviceName: service?.name || "",
    date: selectedDate,
    time: selectedTime,
    duration,
    subtotal,
    discount,
    total,
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {currentStep >= 1 && currentStep <= 4 && (
        <ProgressSteps currentStep={currentStep} />
      )}

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {currentStep === 1 && (
          <StepService
            services={SERVICES}
            selected={selectedKey}
            setSelected={setSelectedKey}
            onNext={onServiceNext}
          />
        )}

        {currentStep === 2 && (
          <StepTime
            service={service}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            duration={duration}
            setDuration={setDuration}
            totalPrice={subtotal}
            onNext={onTimeNext}
            onBack={goBack}
          />
        )}

        {currentStep === 3 && (
          <StepCustomer
            customerInfo={customerInfo}
            setCustomerInfo={setCustomerInfo}
            pricing={pricingSummary}
            onNext={onCustomerNext}
            onBack={goBack}
          />
        )}

        {currentStep === 4 && (
          <StepConfirm
            service={service}
            date={selectedDate}
            time={selectedTime}
            duration={duration}
            customer={customerInfo}
            pricing={pricingSummary}
            onBack={goBack}
            onConfirm={onConfirm}
            submitting={submitting}
          />
        )}

        {currentStep === 99 && (
          <Success
            code={successCode}
            onNew={resetAll}
            onHome={() => navigation.navigate("Root", { screen: "Home" })}
          />
        )}
      </ScrollView>
    </View>
  );
}

/* =========================
   Styles
========================= */
const styles = StyleSheet.create({
  // Progress
  progressWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  progressItem: { flexDirection: "row", alignItems: "center", flex: 1 },
  progressDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  progressNum: { fontWeight: "700" },
  progressText: {
    marginLeft: 8,
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "600",
  },
  progressLine: {
    height: 1,
    backgroundColor: "#e5e7eb",
    flex: 1,
    marginHorizontal: 8,
  },

  // Generic
  sectionHeader: { alignItems: "center", marginBottom: 16 },
  h1: { fontSize: 24, fontWeight: "800", color: "#111827" },
  muted: { color: "#6b7280" },
  actionsCenter: { marginTop: 16, alignItems: "center" },
  actionsBetween: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnPrimary: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 160,
    alignItems: "center",
  },
  btnPrimaryText: { color: "#fff", fontWeight: "700" },
  btnDisabled: { opacity: 0.5 },
  btnGray: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  btnGrayText: { color: "#374151", fontWeight: "600" },

  // Card service
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  cardDesc: { color: "#6b7280", marginBottom: 8 },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  cardPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#a7f3d0",
    color: "#065f46",
    backgroundColor: "#ecfdf5",
    fontSize: 12,
  },

  // Two columns container (stack on mobile)
  twoCols: { rowGap: 12 },
  panel: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    marginBottom: 12,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },

  // Calendar
  calHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  iconBtn: { padding: 6, borderRadius: 8 },
  calMonth: { fontWeight: "700", color: "#111827" },
  weekRow: { flexDirection: "row", marginBottom: 4 },
  weekCell: {
    width: `${100 / 7}%`,
    textAlign: "center",
    color: "#6b7280",
    fontWeight: "600",
    paddingVertical: 6,
    fontSize: 12,
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  dayCell: { width: `${100 / 7}%`, padding: 4 },
  dayCellInner: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#f3f4f6",
  },
  dayText: { fontWeight: "600", color: "#111827" },

  // Time & duration
  label: { fontWeight: "600", color: "#374151", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  hint: { fontSize: 12, color: "#6b7280", marginTop: 6 },
  warnBox: {
    marginTop: 8,
    backgroundColor: "#fffbeb",
    borderColor: "#fde68a",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  warnText: { color: "#92400e" },
  subTitle: { fontWeight: "700", color: "#111827", marginBottom: 8 },
  durationRow: { flexDirection: "row", alignItems: "center" },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  roundBtnText: { fontSize: 18, fontWeight: "700", color: "#111827" },
  bigNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },

  // Customer
  row2: { flexDirection: "row" },
  payBox: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    padding: 12,
    borderRadius: 12,
  },
  payTitle: { fontWeight: "700", color: "#065f46", marginBottom: 6 },
  radioRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#a7f3d0",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: { borderColor: "#059669" },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#059669",
  },
  payText: { marginLeft: 8, color: "#065f46" },

  // Summary rows
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLabel: { color: "#6b7280" },
  rowValue: { color: "#111827", fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#e5e7eb", marginTop: 10 },

  // Confirm
  block: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 12,
  },
  blockTitle: { fontWeight: "700", color: "#111827", marginBottom: 8 },
  serviceRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  kv: { color: "#6b7280", marginBottom: 4 },
  kvV: { color: "#111827", fontWeight: "600" },
  payDetail: { backgroundColor: "#f9fafb", padding: 12, borderRadius: 12 },

  // Success
  panelCenter: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  successBox: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
    alignSelf: "stretch",
    alignItems: "center",
  },
  successCode: { fontSize: 20, fontWeight: "800", color: "#065f46" },
});
