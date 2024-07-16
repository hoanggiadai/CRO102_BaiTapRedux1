import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addThuChi, deleteThuChi, updateThuChi } from '../redux/reducers/thuChiReducer';

const ThuChiScreen = () => {
    const [tieuDe, setTieuDe] = useState('');
    const [moTa, setMoTa] = useState('');
    const [ngay, setNgay] = useState(new Date());
    const [loai, setLoai] = useState('');
    const [soTien, setSoTien] = useState('');
    const [error, setError] = useState('');

    const [searchTerm, setSearchTerm] = useState('');

    const [showOptions, setShowOptions] = useState(false);

    const [options] = useState(['Thu', 'Chi']); // Danh sách các lựa chọn

    const handleSelectOption = (option) => {
        setLoai(option);
        setShowOptions(false);
    };

    // State để lưu trữ thông tin chi tiết của mục được chọn
    const [selectedItem, setSelectedItem] = useState(null);

    const listThuChi = useSelector(state => state.listThuChi.listThuChi);
    const dispatch = useDispatch();

    const handleSelectItem = (item) => {
        // Đặt thông tin của item được chọn vào state để hiển thị lên TextInput
        setSelectedItem(item);
        setTieuDe(item.tieuDe);
        setMoTa(item.moTa);
        setNgay(item.ngay);
        setLoai(item.loai);
        setSoTien(item.soTien.toString()); // Chuyển đổi sang chuỗi nếu cần thiết
    }

    const handleAddThuChi = () => {
        if (!tieuDe.trim() || !moTa.trim() || !ngay.trim() || !loai.trim() || !soTien.trim()) {
            setError('Không được để trống!');
        } else if (isNaN(Number(soTien))) {
            setError('Số tiền phải là số');
        } else {
            let duLieuThem = { id: Math.random().toString(), tieuDe, moTa, ngay, loai, soTien };
            dispatch(addThuChi(duLieuThem));
            // Reset các TextInput về rỗng sau khi thêm thành công
            resetInputs();
            setError('');
        }
    }

    useEffect(() => {
        // Reset các TextInput về rỗng sau khi danh sách listThuChi thay đổi
    }, [listThuChi]);

    const handleDeleteThuChi = (id) => {
        Alert.alert(
            'Xác nhận xóa',
            'Bạn có chắc chắn muốn xóa?',
            [
              { text: 'Hủy', style: 'cancel' },
              {
                text: 'Đồng ý',
                onPress: () => {
                  dispatch(deleteThuChi(id));
                },
              },
            ],
            { cancelable: false }
        );
    }

    const handleUpdateThuChi = () => {
        // Xử lý cập nhật thông tin cho mục được chọn
        if (!tieuDe.trim() || !moTa.trim() || !ngay.trim() || !loai.trim() || !soTien.trim()) {
            setError('Không được để trống!');
        } else if (isNaN(Number(soTien))) {
            setError('Số tiền phải là số');
        } else {
            // Tạo đối tượng cập nhật
            let updatedItem = {
                ...selectedItem,
                tieuDe,
                moTa,
                ngay,
                loai,
                soTien
            };
            dispatch(updateThuChi(updatedItem));
            // Reset các TextInput và state của mục được chọn
            resetInputs();
            setError('');
        }
    }

    // Tính tổng số tiền thu và tổng số tiền chi
    const totalThu = listThuChi.reduce((acc, curr) => {
        if (curr.loai === 'Thu') {
            return acc + Number(curr.soTien);
        }
        return acc;
    }, 0);

    const totalChi = listThuChi.reduce((acc, curr) => {
        if (curr.loai === 'Chi') {
            return acc + Number(curr.soTien);
        }
        return acc;
    }, 0);

    // Lọc danh sách thu chi theo tiêu đề khi có từ khóa tìm kiếm
    const filteredThuChi = listThuChi.filter(item =>
        item.tieuDe.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const ThuChiItem = ({ tc }) => {
        return (
            <TouchableOpacity style={styles.item} onPress={()=> handleSelectItem(tc)}>
                <View style={styles.ngang}>
                    <Text style={styles.tieuDe}>{tc.tieuDe}</Text>
                    <Text style={styles.ngay}>Ngày: {tc.ngay}</Text>
                </View>
                <View style={styles.ngang}>
                    <Text style={styles.mieuTa}>Mô tả{'\n' + tc.moTa}</Text>
                    <TouchableOpacity onPress={() => handleDeleteThuChi(tc.id)}>
                        <Image source={require('../assest/img/delete24.png')} style={styles.delete} />
                    </TouchableOpacity>
                </View>
                <View style={styles.ngang}>
                    <Text style={styles.soTien}>{tc.soTien} VNĐ</Text>
                    <Text style={styles.loai}>Loại: {tc.loai}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    // Function to reset input fields and selected item state
    const resetInputs = () => {
        setTieuDe('');
        setMoTa('');
        setNgay('');
        setLoai('');
        setSoTien('');
        setSelectedItem(null);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>QUẢN LÝ THU CHI</Text>
            <TextInput
                placeholder='Nhập tiêu đề'
                onChangeText={setTieuDe}
                value={tieuDe}
                style={styles.input} />
            <TextInput
                multiline={true}
                placeholder='Nhập mô tả'
                onChangeText={setMoTa}
                value={moTa}
                style={styles.input} />
            <TextInput
                placeholder='Nhập ngày'
                onChangeText={setNgay}
                value={ngay}
                style={styles.input}
                />
            <TouchableOpacity
                style={styles.touchableContainer}
                onPress={() => setShowOptions(!showOptions)}
            >
                <TextInput
                    placeholder='Nhập loại (thu/chi)'
                    editable={false}
                    value={loai}
                    style={styles.input}
                />
            </TouchableOpacity>

            {showOptions && (
                <View style={styles.optionsContainer}>
                    <FlatList
                        data={options}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSelectOption(item)}>
                                <Text style={styles.option}>{item}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            )}
            <TextInput
                keyboardType='numeric'
                placeholder='Nhập số tiền'
                onChangeText={setSoTien}
                value={soTien}
                style={styles.input} />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity style={styles.bt_them} onPress={handleAddThuChi}>
                    <Text style={styles.bt_them_text}>THÊM</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bt_sua} onPress={handleUpdateThuChi}>
                    <Text style={styles.bt_them_text}>SỬA</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.separator} />
            <Text style={styles.title2}>Danh sách thu chi</Text>
            <TextInput
                placeholder='Tìm kiếm'
                onChangeText={setSearchTerm}
                style={styles.input}
            />
            <Text>Tổng số tiền thu: {totalThu} VNĐ</Text>
            <Text>Tổng số tiền chi: {totalChi} VNĐ</Text>

            <SafeAreaView style={styles.listContainer}>
                <FlatList
                    data={filteredThuChi} 
                    renderItem={({ item }) => <ThuChiItem tc={item} />}
                    keyExtractor={item => item.id}
                />
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    bt_them: {
        width: 180,
        height: 50,
        borderRadius: 10,
        marginRight: 10,
        alignSelf: 'center',
        backgroundColor: 'blue',
        justifyContent: 'center',
    },
    bt_sua: {
        width: 180,
        height: 50,
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: 'green',
        justifyContent: 'center',
    },
    bt_them_text: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        marginBottom: 20
    },
    title2: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 20
    },
    input: {
        borderWidth: 0.5,
        borderColor: 'black',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    item: {
        backgroundColor: 'cyan',
        padding: 15,
        marginBottom: 10
    },
    delete: {
        width: 50,
        height: 50,
        resizeMode: 'center',
    },
    ngang: {
        flexDirection: 'row'
    },
    tieuDe: {
        width: 250,
        fontSize: 20,
        color: '#001100',
        fontWeight: '700',
        marginBottom: 8
    },
    ngay: {
        fontSize: 16,
        fontStyle: 'italic'
    },
    mieuTa: {
        width: 300,
        fontSize: 16,
        color: 'black',
        marginBottom: 8
    },
    loai: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
    },
    soTien: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        width: 250
    },
    error: {
        color: 'red',
        fontSize: 18,
        fontStyle: 'italic',
        marginStart: 10,
        marginBottom: 15,
    },
    listContainer: {
        flex: 1,
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: 'black',
        marginVertical: 10,
    },
});

export default ThuChiScreen;