\#Game người que đại chiến (nghe ngầu vcl).



\##Mô tả.  

-Đây là game đang trong giai đoạn phát triển (nếu thằng làm game không bị chán hoặc bị ngu).  

-Game chạy trên trình duyệt, có 2 chế độ singleplayer để khổ dâm một mình và multiplayer để 2 thằng khấc vào đánh nhau.



\##Cách chạy.  

-Chạy file index.html bằng trình duyệt và chơi thôi.  

-Có thể host trên local bằng lệnh (tự lên gpt mà xem).



\##Hướng dẫn chơi game.  

-Trong game k có hướng dẫn mẹ gì nên không đọc file này hoặc không có thằng tạo game chỉ cho thì ăn cứt vì game có khá nhiều nút.  

-Đối với singleplayer thì game có 2 chế độ, sáng tạo và bình thường có thể chuyển đổi bang nút c.  

-Các nút:

| Chức năng       | P1 / 1P | P2         |
|-----------------|---------|------------|
| Sang phải       | D       | → (Right)  |
| Sang trái       | A       | ← (Left)   |
| Lên trên        | W       | ↑ (Up)     |
| Dựng khiên      | S       | ↓ (Down)   |
| Đánh thường     | J       | 1          |
| Đánh mạnh       | K       | 2          |
| Lăn             | L       | 3          |
| Chưởng thường   | U       | 4          |
| Chưởng mạnh     | I       | 5          |
| Bú máu          | 2       | 8          |
| Bú mana         | 1       | 7          |




\##Lối chơi.  

-\*\*Singleplayer\*\* (có đánh boss nhưng sẽ update sau).  

-\*\*Multiplayer\*\* (đánh nhau đến chết).



\##Cơ chế combat của game.  

-Game có thanh máu 100hp, 25 mana và 50 stamina, cùng với đó là 2 loại thuốc: 5x hp và 2xmana.  

-Thanh máu và mana có thể hồi phục bằng thuốc, thuốc hp hồi 50 máu và mana hồi toàn bộ.  

-Stamina khi chưa cạn sẽ mất 1.5 giây để hồi đầy và là 2 giây nếu đã cạn, thời gian hồi sẽ tính từ lần cuối nhận dame.  

-\*\*Di chuyển:\*\* thằng nào không biết là thằng ngu.  

-\*\*Dựng khiên:\*\* dựng khiên có thể chặn toàn bộ dame vật lí, nhưng không thể chặn toàn bộ dame phép, mỗi khi dựng khiên mà bị nhận sát thương vật lí sẽ tiêu tốn stamina = dame/2, còn với sát thương phép thì tốn lượng stamina tương đương cùng với đó là vẫn ăn nửa lượng dame phép, khi dựng khiên mà bị đánh đến cạn stamina hoặc ăn đánh mạnh sẽ bị mất thế khiên đồng thời ăn choáng trong 1 giây (stamina vẫn hồi kể cả khi đang dựng khiên). Khi dựng khiên giảm tốc 80%.  

-\*\*Đánh thường:\*\* dame 10, loss stamina 10, 0.1s charge.  

-\*\*Đánh mạnh:\*\* dame 40, loss stamina 20, có thể phá thế khiên, 0.5s charge.  

-\*\*Lăn:\*\* loss stamina 20, lăn một đoạn 100px (nếu không biết 100px dài bao nhiêu thì nó khá bằng chiều cao của con nhân vật) trong 0.2s, khi roll được miễn thương.  

-\*\*Chưởng thường:\*\* dame 20, loss mana 3, loss stamina 10, 0.2s charge, bắn đạn sau khi vận.  

-\*\*Chưởng mạnh:\*\* dame 80, loss mana 10, loss stamina 20, 1.5s charge, bắn đạn to hơn sau khi vận.  

\*\*Note:\*\* Riêng multiplayer, đạn sau khi bắn sẽ nảy lại qua các bức tường, mỗi lần nhảy tăng 5% tốc độ và có thể bóp vào hạ bộ thằng bắn. Còn riêng singleplayer có chế độ sáng tạo là được bất tử và không giới hạn đồ cast phép.

