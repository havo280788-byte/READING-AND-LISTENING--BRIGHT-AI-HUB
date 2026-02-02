
import { UnitData, ClozeQuestion, SentenceScrambleItem, PracticeTestData, ErrorCorrectionData, GrammarChallengeData, WordFormData, ReadingData, ListeningData, VocabularyWord } from './types';

// ==========================================
// STABLE VOCABULARY ARCHIVE (Units 1 - 4)
// Integrated Word Family data for nested display
// ==========================================

export const UNIT1_VOCAB: VocabularyWord[] = [
  { id: 'u1_1', english: 'conflict', phonetic: '/ˈkɒnflɪkt/', vietnamese: 'Xung đột', example: 'Arguments about clothes often lead to conflict between parents and teens.', wordFamily: 'Noun/Verb: conflict; Adj: conflicting, conflicted' },
  { id: 'u1_2', english: 'nuclear family', phonetic: '/ˌnjuːkliə ˈfæmili/', vietnamese: 'Gia đình hạt nhân', example: 'Most people in modern cities live in a nuclear family.', wordFamily: 'Noun: nuclear family' },
  { id: 'u1_3', english: 'extended family', phonetic: '/ɪkˌstendɪd ˈfæmili/', vietnamese: 'Gia đình đa thế hệ', example: 'Living in an extended family helps children bond with their grandparents.', wordFamily: 'Noun: extended family' },
  { id: 'u1_4', english: 'curfew', phonetic: '/ˈkɜːfjuː/', vietnamese: 'Giờ giới nghiêm', example: 'My parents set a strict 9 p.m. curfew for the weekend.', wordFamily: 'Noun: curfew' },
  { id: 'u1_5', english: 'privacy', phonetic: '/ˈprɪvəsi/', vietnamese: 'Sự riêng tư', example: 'Teenagers usually value their privacy more as they grow older.', wordFamily: 'Noun: privacy; Adj: private; Adv: privately' },
  { id: 'u1_6', english: 'conservative', phonetic: '/kənˈsɜːvətɪv/', vietnamese: 'Bảo thủ', example: 'Older generations tend to have more conservative views on fashion.', wordFamily: 'Adj: conservative; Noun: conservatism; Adv: conservatively' },
  { id: 'u1_7', english: 'independent', phonetic: '/ˌɪndɪˈpendənt/', vietnamese: 'Tự lập', example: 'Students should learn to be independent by doing their own chores.', wordFamily: 'Adj: independent; Noun: independence; Adv: independently' },
  { id: 'u1_8', english: 'generation gap', phonetic: '/ˌdʒenəˈreɪʃn ɡæp/', vietnamese: 'Khoảng cách thế hệ', example: 'Open communication is key to bridging the generation gap.', wordFamily: 'Noun: generation gap' },
  { id: 'u1_9', english: 'table manners', phonetic: '/ˈteɪbl ˌmænəz/', vietnamese: 'Phép tắc ăn uống', example: 'Good table manners are essential when eating with elders.', wordFamily: 'Noun: table manners' },
  { id: 'u1_10', english: 'strict', phonetic: '/strɪkt/', vietnamese: 'Nghiêm khắc', example: 'Our teacher is very strict about submitting homework on time.', wordFamily: 'Adj: strict; Noun: strictness; Adv: strictly' },
  { id: 'u1_11', english: 'viewpoint', phonetic: '/ˈvjuːpɔɪnt/', vietnamese: 'Quan điểm', example: 'Try to understand the situation from your parents\' viewpoint.', wordFamily: 'Noun: viewpoint' },
  { id: 'u1_12', english: 'impose', phonetic: '/ɪmˈpəʊz/', vietnamese: 'Áp đặt', example: 'Parents should not impose their career choices on their children.', wordFamily: 'Verb: impose; Noun: imposition' },
  { id: 'u1_13', english: 'flashy', phonetic: '/ˈflæʃi/', vietnamese: 'Hào nhoáng', example: 'He likes wearing flashy clothes to attract attention.', wordFamily: 'Adj: flashy; Adv: flashily; Verb/Noun: flash' },
  { id: 'u1_14', english: 'footsteps', phonetic: '/ˈfʊtsteps/', vietnamese: 'Theo bước chân/nối nghiệp', example: 'She decided to follow in her father\'s footsteps and become a doctor.', wordFamily: 'Noun: footsteps' },
  { id: 'u1_15', english: 'childcare', phonetic: '/ˈtʃaɪldkeə(r)/', vietnamese: 'Việc chăm sóc trẻ em', example: 'Both parents should share the responsibility of childcare.', wordFamily: 'Noun: childcare' }
];

export const UNIT2_VOCAB: VocabularyWord[] = [
  { id: 'u2_1', english: 'cave', phonetic: '/keɪv/', vietnamese: 'hang động', example: 'The explorers found ancient drawings inside the cave.', wordFamily: 'n', visualPrompt: 'A majestic limestone cave with stalactites and stalagmites, natural sunlight beaming through' },
  { id: 'u2_2', english: 'mountain', phonetic: '/ˈmaʊntɪn/', vietnamese: 'núi', example: 'Mount Everest is the highest mountain in the world.', wordFamily: 'n', visualPrompt: 'High mountains covered in green forests and white clouds, aerial view' },
  { id: 'u2_3', english: 'valley', phonetic: '/ˈvæli/', vietnamese: 'thung lũng', example: 'The village is in the valley.', wordFamily: 'n', visualPrompt: 'A lush green valley between high peaks with a small river winding through' },
  { id: 'u2_4', english: 'waterfall', phonetic: '/ˈwɔːtəfɔːl/', vietnamese: 'thác nước', example: 'We took photos of the beautiful waterfall.', wordFamily: 'n', visualPrompt: 'A powerful waterfall cascading down a cliff into a crystal clear pool' },
  { id: 'u2_5', english: 'dune', phonetic: '/djuːn/', vietnamese: 'đụn cát', example: 'The children rolled down the sand dune.', wordFamily: 'n', visualPrompt: 'Golden sand dunes in Mui Ne under a bright blue sky, wind patterns on sand' },
  { id: 'u2_6', english: 'temple', phonetic: '/ˈtempl/', vietnamese: 'đền, miếu', example: 'Locals visit the temple to pray for good luck.', wordFamily: 'n', visualPrompt: 'An ancient Vietnamese temple with incense smoke and traditional red banners' },
  { id: 'u2_7', english: 'pagoda', phonetic: '/pəˈɡəʊdə/', vietnamese: 'chùa', example: 'The pagoda is peaceful.', wordFamily: 'n', visualPrompt: 'A serene multi-story pagoda surrounded by lotus ponds and gardens' },
  { id: 'u2_8', english: 'cathedral', phonetic: '/kəˈθiːdrəl/', vietnamese: 'nhà thờ lớn', example: 'The cathedral in the city center is very old.', wordFamily: 'n', visualPrompt: 'Notre-Dame Cathedral Basilica of Saigon with red brick architecture' },
  { id: 'u2_9', english: 'citadel', phonetic: '/ˈsɪtədl/', vietnamese: 'thành quách', example: 'The old citadel is historic.', wordFamily: 'n', visualPrompt: 'The ancient Hue Citadel stone walls and majestic entrance gates' },
  { id: 'u2_10', english: 'palace', phonetic: '/ˈpælɪs/', vietnamese: 'cung điện', example: 'The king lives in a palace.', wordFamily: 'n', visualPrompt: 'A grand royal palace with golden roof tiles and intricate carvings' },
  { id: 'u2_11', english: 'tourist attraction', phonetic: '/ˈtʊərɪst əˈtrækʃən/', vietnamese: 'điểm du lịch', example: 'Ha Long Bay is a famous tourist attraction.', wordFamily: 'n', visualPrompt: 'A crowded famous landmark in Vietnam with many international tourists' },
  { id: 'u2_12', english: 'architecture', phonetic: '/ˈɑːkɪtekʧə/', vietnamese: 'kiến trúc', example: 'I like the architecture of this building.', wordFamily: 'n', visualPrompt: 'Traditional Vietnamese wooden architecture with lotus patterns' },
  { id: 'u2_13', english: 'historical', phonetic: '/hɪsˈtɒrɪkəl/', vietnamese: 'thuộc lịch sử', example: 'It is a historical event.', wordFamily: 'adj', visualPrompt: 'Old historical documents and artifacts displayed in a museum' },
  { id: 'u2_14', english: 'historic', phonetic: '/hɪsˈtɒrɪk/', vietnamese: 'có ý nghĩa lịch sử', example: 'This is a historic day.', wordFamily: 'adj', visualPrompt: 'A historic moment at Independence Palace with flags waving' },
  { id: 'u2_15', english: 'traditional', phonetic: '/trəˈdɪʃənəl/', vietnamese: 'truyền thống', example: 'She wears traditional clothes.', wordFamily: 'adj', visualPrompt: 'Vietnamese people wearing Ao Dai and traditional conical hats' },
  { id: 'u2_16', english: 'crowded', phonetic: '/ˈkraʊdɪd/', vietnamese: 'đông đúc', example: 'The street is very crowded.', wordFamily: 'adj', visualPrompt: 'A crowded night market in Hanoi with many stalls and people' },
  { id: 'u2_17', english: 'picturesque', phonetic: '/ˌpɪkʧəˈresk/', vietnamese: 'đẹp như tranh', example: 'The view is picturesque.', wordFamily: 'adj', visualPrompt: 'A picturesque small village by a river with blooming flowers' },
  { id: 'u2_18', english: 'modern', phonetic: '/ˈmɒdən/', vietnamese: 'hiện đại', example: 'The city is very modern.', wordFamily: 'adj', visualPrompt: 'A modern skyline of Ho Chi Minh City with Bitexco Tower' },
  { id: 'u2_19', english: 'narrow', phonetic: '/ˈnærəʊ/', vietnamese: 'hẹp', example: 'The path is very narrow.', wordFamily: 'adj', visualPrompt: 'A narrow ancient alley in Hoi An with yellow walls' },
  { id: 'u2_20', english: 'worship', phonetic: '/ˈwɜːʃɪp/', vietnamese: 'sự thờ cúng / thờ cúng', example: 'They worship their ancestors.', wordFamily: 'n/v', visualPrompt: 'People practicing worship rituals at a traditional altar with fruit and flowers' }
];

export const UNIT3_VOCAB: VocabularyWord[] = [
  { id: 'u3_1', english: 'greenhouse gas', phonetic: '/ˌɡriːnhaʊs ˈɡæs/', vietnamese: 'Khí nhà kính', example: 'Carbon dioxide is a major greenhouse gas causing global warming.', wordFamily: 'Noun: greenhouse gas' },
  { id: 'u3_2', english: 'deforestation', phonetic: '/ˌdiːˌfɒrɪˈsteɪʃn/', vietnamese: 'Nạn phá rừng', example: 'Deforestation leads to the loss of natural habitats for many animals.', wordFamily: 'Noun: deforestation; Verb: deforest' },
  { id: 'u3_3', english: 'carbon footprint', phonetic: '/ˌkɑːbən ˈfʊtprɪnt/', vietnamese: 'Dấu chân carbon', example: 'We can reduce our carbon footprint by using public transport.', wordFamily: 'Noun: carbon footprint' },
  { id: 'u3_4', english: 'fossil fuels', phonetic: '/ˈfɒsl fjuːəlz/', vietnamese: 'Nhiên liệu hóa thạch', example: 'Burning fossil fuels releases harmful emissions into the atmosphere.', wordFamily: 'Noun: fossil fuels' },
  { id: 'u3_5', english: 'renewable energy', phonetic: '/rɪˈnjuːəbl ˈenədʒi/', vietnamese: 'Năng lượng tái tạo', example: 'Solar and wind power are clean sources of renewable energy.', wordFamily: 'Noun: renewable energy; Verb: renew; Adj: renewable' },
  { id: 'u3_6', english: 'emission', phonetic: '/iˈmɪʃn/', vietnamese: 'Sự phát thải', example: 'Many factories are trying to cut down their toxic emissions.', wordFamily: 'Noun: emission; Verb: emit' },
  { id: 'u3_7', english: 'global warming', phonetic: '/ˌɡləʊbl ˈwɔːmɪŋ/', vietnamese: 'Sự nóng lên toàn cầu', example: 'Global warming is causing the polar ice caps to melt.', wordFamily: 'Noun: global warming; Adj/Verb: warm' },
  { id: 'u3_8', english: 'consequence', phonetic: '/ˈkɒnsɪkwəns/', vietnamese: 'Hậu quả', example: 'Severe floods are one of the consequences of climate change.', wordFamily: 'Noun: consequence; Adj: consequent; Adv: consequently' },
  { id: 'u3_9', english: 'ecosystem', phonetic: '/ˈiːkəʊsɪstəm/', vietnamese: 'Hệ sinh thái', example: 'Pollution can destroy the delicate balance of an ecosystem.', wordFamily: 'Noun: ecosystem' },
  { id: 'u3_10', english: 'infectious', phonetic: '/ɪnˈfekʃəs/', vietnamese: 'Truyền nhiễm', example: 'Warmer weather can help the spread of infectious diseases.', wordFamily: 'Adj: infectious; Noun: infection; Verb: infect' },
  { id: 'u3_11', english: 'methane', phonetic: '/ˈmiːθeɪn/', vietnamese: 'Khí metan', example: 'Livestock farming produces a significant amount of methane.', wordFamily: 'Noun: methane' },
  { id: 'u3_12', english: 'catastrophic', phonetic: '/ˌkætəˈstrɒfɪk/', vietnamese: 'Thảm khốc', example: 'A catastrophic drought could lead to widespread food shortages.', wordFamily: 'Adj: catastrophic; Noun: catastrophe; Adv: catastrophically' },
  { id: 'u3_13', english: 'absorb', phonetic: '/əbˈzɔːb/', vietnamese: 'Hấp thụ', example: 'Forests help to absorb carbon dioxide from the air.', wordFamily: 'Verb: absorb; Noun: absorption; Adj: absorbent' },
  { id: 'u3_14', english: 'impact', phonetic: '/ˈɪmpækt/', vietnamese: 'Tác động', example: 'Plastic waste has a negative impact on marine life.', wordFamily: 'Noun/Verb: impact' },
  { id: 'u3_15', english: 'disrupt', phonetic: '/dɪsˈrʌpt/', vietnamese: 'Làm gián đoạn/xáo trộn', example: 'Extreme weather events can disrupt local agriculture.', wordFamily: 'Verb: disrupt; Noun: disruption; Adj: disruptive' }
];

export const UNIT4_VOCAB: VocabularyWord[] = [
  { id: 'u4_1', english: 'heritage', phonetic: '/ˈherɪtɪdʒ/', vietnamese: 'Di sản', example: 'Ha Long Bay is a famous World Heritage Site in Vietnam.', wordFamily: 'Noun: heritage' },
  { id: 'u4_2', english: 'preservation', phonetic: '/ˌprezəˈveɪʃn/', vietnamese: 'Sự bảo tồn', example: 'The preservation of historic buildings is vital for our culture.', wordFamily: 'Noun: preservation; Verb: preserve' },
  { id: 'u4_3', english: 'intangible', phonetic: '/ɪnˈtændʒəbl/', vietnamese: 'Phi vật thể', example: 'Quan Ho singing is part of our intangible cultural heritage.', wordFamily: 'Adj: intangible; Noun: intangibility' },
  { id: 'u4_4', english: 'restoration', phonetic: '/ˌrestəˈreɪʃn/', vietnamese: 'Sự phục dựng/trùng tu', example: 'The restoration of the ancient gate was completed last year.', wordFamily: 'Noun: restoration; Verb: restore' },
  { id: 'u4_5', english: 'architecture', phonetic: '/ˈɑːkɪtektʃə(r)/', vietnamese: 'Kiến trúc', example: 'I admire the unique architecture of the Imperial Citadel.', wordFamily: 'Noun: architecture, architect; Adj: architectural' },
  { id: 'u4_6', english: 'archaeological', phonetic: '/ˌɑːkiəˈlɒdʒɪkl/', vietnamese: 'Thuộc về khảo cổ', example: 'My Son Sanctuary is an important archaeological site.', wordFamily: 'Adj: archaeological; Noun: archaeology, archaeologist' },
  { id: 'u4_7', english: 'landscape', phonetic: '/ˈlændskeɪp/', vietnamese: 'Phong cảnh', example: 'Trang An is famous for its stunning limestone landscape.', wordFamily: 'Noun: landscape' },
  { id: 'u4_8', english: 'citadel', phonetic: '/ˈsɪtədəl/', vietnamese: 'Hoàng thành', example: 'The Thang Long Imperial Citadel is located in the heart of Hanoi.', wordFamily: 'Noun: citadel' },
  { id: 'u4_9', english: 'folk singing', phonetic: '/ˈfəʊk sɪŋɪŋ/', vietnamese: 'Hát dân ca', example: 'Vietnam has many traditional styles of folk singing.', wordFamily: 'Noun: folk singing' },
  { id: 'u4_10', english: 'recognize', phonetic: '/ˈrekəɡnaɪz/', vietnamese: 'Công nhận', example: 'UNESCO recognizes sites with outstanding universal value.', wordFamily: 'Verb: recognize; Noun: recognition; Adj: recognizable' },
  { id: 'u4_11', english: 'safeguard', phonetic: '/ˈsetfɡɑːd/', vietnamese: 'Bảo vệ/giữ gìn', example: 'We must safeguard our traditions for the next generation.', wordFamily: 'Verb/Noun: safeguard' },
  { id: 'u4_12', english: 'flora and fauna', phonetic: '/ˌflɔːrə ənd ˈfɔːnə/', vietnamese: 'Hệ thực vật và động vật', example: 'The national park is home to diverse flora and fauna.', wordFamily: 'Noun: flora and fauna' },
  { id: 'u4_13', english: 'geological', phonetic: '/ˌdʒiəˈlɒdʒɪkl/', vietnamese: 'Thuộc về địa chất', example: 'Phong Nha cave has great geological and aesthetic value.', wordFamily: 'Adj: geological; Noun: geology, geologist' },
  { id: 'u4_14', english: 'complex', phonetic: '/ˈkɒmpleks/', vietnamese: 'Quần thể', example: 'The Hue Monuments complex is a UNESCO site.', wordFamily: 'Noun/Adj: complex; Noun: complexity' },
  { id: 'u4_15', english: 'authentic', phonetic: '/ɔːˈθentɪk/', vietnamese: 'Đích thực/Nguyên bản', example: 'Preserving the authentic features of the site is important.', wordFamily: 'Adj: authentic; Noun: authenticity; Verb: authenticate' }
];

export const UNIT5_VOCAB: VocabularyWord[] = [
  { id: 'u5_1', english: 'digital road', vietnamese: 'Đường phố kết nối công nghệ số', example: 'Digital roads communicate with smart vehicles to manage traffic flow.', wordFamily: 'n.phr' },
  { id: 'u5_2', english: 'flying vehicles', vietnamese: 'Phương tiện bay', example: 'We might travel to work in flying vehicles in the near future.', wordFamily: 'n.phr' },
  { id: 'u5_3', english: 'underground motorway', vietnamese: 'Đường cao tốc dưới lòng đất', example: 'The city built an underground motorway to reduce surface noise.', wordFamily: 'n.phr' },
  { id: 'u5_4', english: 'skybridge', vietnamese: 'Cầu trên không', example: 'You can walk between the towers using the glass skybridge.', wordFamily: 'n' },
  { id: 'u5_5', english: 'moving walkway', vietnamese: 'Lối đi bộ tự động', example: 'The airport installed a moving walkway to help passengers travel faster.', wordFamily: 'n.phr' },
  { id: 'u5_6', english: 'sensor', vietnamese: 'Cảm biến', example: 'Sensors on the street lights detect when cars are approaching.', wordFamily: 'n' },
  { id: 'u5_7', english: 'smart mirror', vietnamese: 'Gương thông minh', example: 'My smart mirror tells me the weather while I brush my teeth.', wordFamily: 'n.phr' },
  { id: 'u5_8', english: 'foldable', vietnamese: 'Có thể gấp lại', example: 'Foldable furniture is perfect for small future apartments.', wordFamily: 'adj' },
  { id: 'u5_9', english: 'solar window', vietnamese: 'Cửa sổ năng lượng mặt trời', example: 'These solar windows generate power for the entire building.', wordFamily: 'n.phr' },
  { id: 'u5_10', english: 'vacuum tube train', vietnamese: 'Tàu siêu tốc đệm từ', example: 'A vacuum tube train could get us to the capital in 30 minutes.', wordFamily: 'n.phr' },
  { id: 'u5_11', english: 'digital classroom', vietnamese: 'Lớp học số hóa', example: 'In a digital classroom, students collaborate via cloud platforms.', wordFamily: 'n.phr' },
  { id: 'u5_12', english: 'hologram device', vietnamese: 'Thiết bị trình chiếu ảnh 3D', example: 'The professor used a hologram device to display the 3D model.', wordFamily: 'n.phr' },
  { id: 'u5_13', english: 'virtual reality headset', vietnamese: 'Kính thực tế ảo', example: 'Put on your virtual reality headset to visit the virtual museum.', wordFamily: 'n.phr' },
  { id: 'u5_14', english: 'home schooling', vietnamese: 'Giáo dục tại nhà', example: 'Technology has made home schooling more accessible and effective.', wordFamily: 'n' },
  { id: 'u5_15', english: '3D-printed house', vietnamese: 'Nhà in bằng công nghệ 3D', example: 'They built a 3D-printed house in just 24 hours.', wordFamily: 'n.phr' },
  { id: 'u5_16', english: 'data', vietnamese: 'Dữ liệu', example: 'Smart cities rely on big data to optimize services.', wordFamily: 'n' },
  { id: 'u5_17', english: 'measure', vietnamese: 'Đo lường', example: 'We use sensors to measure air pollution levels.', wordFamily: 'v' },
  { id: 'u5_18', english: 'exchange', vietnamese: 'Trao đổi', example: 'Future education encourages students to exchange ideas globally.', wordFamily: 'v/n' },
  { id: 'u5_19', english: 'valuable', vietnamese: 'Có giá trị', example: 'Data is becoming a valuable resource for city planning.', wordFamily: 'adj' },
  { id: 'u5_20', english: 'socialise', vietnamese: 'Giao lưu, kết nối xã hội', example: 'Virtual reality allows us to socialise with friends anywhere.', wordFamily: 'v' }
];

export const UNIT6_VOCAB: VocabularyWord[] = [];
export const UNIT7_VOCAB: VocabularyWord[] = [];
export const UNIT8_VOCAB: VocabularyWord[] = [];

// ==========================================
// PRE-WRITING DATA
// ==========================================

export const unit1PreWriting: SentenceScrambleItem[] = [
  { id: 1, scrambled: ["often", "clothes", "parents", "My", "judge", "my", "and", "hairstyle"], correct_sentence: "My parents often judge my clothes and hairstyle.", vietnamese_meaning: "Bố mẹ tôi thường phán xét quần áo và kiểu tóc của tôi." },
  { id: 2, scrambled: ["arguments", "curfew", "lead", "Strict", "can", "to", "often"], correct_sentence: "Strict curfew can often lead to arguments.", vietnamese_meaning: "Giờ giới nghiêm nghiêm ngặt thường có thể dẫn đến tranh cãi." },
  { id: 3, scrambled: ["opinions", "should", "Parents", "listen", "children's", "their", "to"], correct_sentence: "Parents should listen to their children's opinions.", vietnamese_meaning: "Cha mẹ nên lắng nghe ý kiến của con cái." },
  { id: 4, scrambled: ["independent", "Teenagers", "to", "be", "strive", "more"], correct_sentence: "Teenagers strive to be more independent.", vietnamese_meaning: "Thanh thiếu niên nỗ lực để trở nên tự lập hơn." },
  { id: 5, scrambled: ["communication", "Open", "key", "the", "bridge", "is", "to", "gap"], correct_sentence: "Open communication is the key to bridge gap.", vietnamese_meaning: "Giao tiếp cởi mở là chìa khóa để thu hép khoảng cách." }
];

export const unit2PreWriting: SentenceScrambleItem[] = [
  { id: 1, scrambled: ["famous", "scenery", "Ha Long Bay", "is", "picturesque", "for", "its"], correct_sentence: "Ha Long Bay is famous for its picturesque scenery.", vietnamese_meaning: "Vịnh Hạ Long nổi tiếng với phong cảnh đẹp như tranh vẽ." },
  { id: 2, scrambled: ["ASEAN", "promotes", "and", "solidarity", "regional", "cooperation"], correct_sentence: "ASEAN promotes regional solidarity and cooperation.", vietnamese_meaning: "ASEAN thúc đẩy tinh thần đoàn kết và hợp tác khu vực." },
  { id: 3, scrambled: ["important", "Vietnam", "An", "member", "is", "of", "ASEAN"], correct_sentence: "Vietnam is an important member of ASEAN.", vietnamese_meaning: "Việt Nam là một thành viên quan trọng của ASEAN." },
  { id: 4, scrambled: ["motto", "Identity", "Community", "The", "One", "is", "Vision", "One", "One"], correct_sentence: "The motto is One Vision One Identity One Community.", vietnamese_meaning: "Phương châm là Một Tầm nhìn, Một Bản sắc, Một Cộng đồng." },
  { id: 5, scrambled: ["it", "who", "was", "my", "traditional", "taught", "mother", "values", "me"], correct_sentence: "It was my mother who taught me traditional values.", vietnamese_meaning: "Chính mẹ tôi là người đã dạy tôi các giá trị truyền thống." }
];

export const unit3PreWriting: SentenceScrambleItem[] = [
  { id: 1, scrambled: ["city", "deserted", "Local", "people", "the", "tourists", "as", "arrived"], correct_sentence: "Local people deserted the city as tourists arrived.", vietnamese_meaning: "Người dân địa phương rời bỏ thành phố khi du khách đến." },
  { id: 2, scrambled: ["global", "Human", "activities", "the", "cause", "are", "warming", "main", "of"], correct_sentence: "Human activities are the main cause of global warming.", vietnamese_meaning: "Các hoạt động của con người là nguyên nhân chính gây ra hiện tượng nóng lên toàn cầu." },
  { id: 3, scrambled: ["emissions", "Factories", "toxic", "atmosphere", "into", "the", "release"], correct_sentence: "Factories release toxic emissions into the atmosphere.", vietnamese_meaning: "Các nhà máy thải khí độc vào bầu khí quyển." },
  { id: 4, scrambled: ["renewable", "should", "energy", "We", "sources", "use"], correct_sentence: "We should use renewable energy sources.", vietnamese_meaning: "Chúng ta nên sử dụng các nguồn năng lượng tái tạo." },
  { id: 5, scrambled: ["save", "forests", "help", "CO2", "Planting", "absorb"], correct_sentence: "Planting forests help save absorb CO2.", vietnamese_meaning: "Trồng rừng giúp hấp thụ khí CO2." }
];

export const unit4PreWriting: SentenceScrambleItem[] = [
  { id: 1, scrambled: ["monument", "is", "both", "ancient", "and", "The", "well-known"], correct_sentence: "The monument is both ancient and well-known.", vietnamese_meaning: "Di tích này vừa cổ kính vừa nổi tiếng." },
  { id: 2, scrambled: ["heritage", "preserve", "must", "We", "our", "cultural"], correct_sentence: "We must preserve our cultural heritage.", vietnamese_meaning: "Chúng ta phải bảo tồn di sản văn hóa của mình." },
  { id: 3, scrambled: ["tourism", "Mass", "heritage", "can", "damage", "sites"], correct_sentence: "Mass tourism can damage heritage sites.", vietnamese_meaning: "Du lịch đại chúng có thể gây hại cho các khu di sản." },
  { id: 4, scrambled: ["nor", "Neither", "monuments", "the", "castles", "were", "the", "safe"], correct_sentence: "Neither the monuments nor the castles were safe.", vietnamese_meaning: "Cả di tích lẫn lâu đài đều không được an toàn." },
  { id: 5, scrambled: ["is", "Thang Long", "a", "Citadel", "Heritage", "World", "Site"], correct_sentence: "Thang Long Citadel is a World Heritage Site.", vietnamese_meaning: "Hoàng thành Thăng Long là Di sản Thế giới." }
];

// ==========================================
// PRACTICE TESTS
// ==========================================

export const UNIT1_PRACTICE_TEST: PracticeTestData = {
  module_id: "u1_practice_test",
  title: "Unit 1: Elite Challenge",
  unit_context: "Unit 1: Generation Gap",
  type: "gamified_test",
  total_questions: 30,
  time_limit_minutes: 30,
  description: "Comprehensive B1 Assessment: Vocab, Grammar, Synonyms, Antonyms.",
  sections: [
    {
      section_name: "Vocabulary & Grammar Mastery",
      questions: [
        // Vocabulary (1-12)
        { id: 1, type: 'multiple_choice', question: "The ______ is the difference in attitudes or behavior between younger and older age groups.", options: ["generation gap", "social change", "culture shock", "family conflict"], answer: "generation gap", explanation: "Definition: generation gap refers to the differences between generations." },
        { id: 2, type: 'multiple_choice', question: "A ______ family consists of only parents and their children living together.", options: ["nuclear", "extended", "joint", "single"], answer: "nuclear", explanation: "Nuclear family: the basic family unit of parents and children." },
        { id: 3, type: 'multiple_choice', question: "Living in an ______ family allows children to bond with their grandparents and other relatives.", options: ["extended", "nuclear", "modern", "dependent"], answer: "extended", explanation: "Extended family includes relatives beyond the nuclear family." },
        { id: 4, type: 'multiple_choice', question: "My parents set a strict 9 p.m. ______ for the weekend.", options: ["curfew", "deadline", "schedule", "limit"], answer: "curfew", explanation: "Curfew: a rule requiring a person to be home at a certain time." },
        { id: 5, type: 'multiple_choice', question: "Teenagers usually value their ______ more as they grow older.", options: ["privacy", "publicity", "company", "money"], answer: "privacy", explanation: "Privacy: the state of being free from public attention." },
        { id: 6, type: 'multiple_choice', question: "Older generations tend to have more ______ views on fashion and music.", options: ["conservative", "modern", "open", "liberal"], answer: "conservative", explanation: "Conservative: holding to traditional attitudes and values." },
        { id: 7, type: 'multiple_choice', question: "Students should learn to be ______ by doing their own chores.", options: ["independent", "dependent", "lazy", "supported"], answer: "independent", explanation: "Independent: capable of acting for oneself." },
        { id: 8, type: 'multiple_choice', question: "Arguments about clothes often lead to ______ between parents and teens.", options: ["conflict", "peace", "agreement", "harmony"], answer: "conflict", explanation: "Conflict: a serious disagreement or argument." },
        { id: 9, type: 'multiple_choice', question: "Good table ______ are essential when eating with elders.", options: ["manners", "styles", "habits", "looks"], answer: "manners", explanation: "Table manners: polite behavior while eating." },
        { id: 10, type: 'multiple_choice', question: "She decided to follow in her father's ______ and become a doctor.", options: ["footsteps", "shoes", "path", "career"], answer: "footsteps", explanation: "Follow in one's footsteps: to do the same work as someone else." },
        { id: 11, type: 'multiple_choice', question: "Parents should not ______ their decisions on their children.", options: ["impose", "give", "make", "take"], answer: "impose", explanation: "Impose: to force someone to accept something." },
        { id: 12, type: 'multiple_choice', question: "He likes wearing ______ clothes that attract a lot of attention.", options: ["flashy", "plain", "dark", "simple"], answer: "flashy", explanation: "Flashy: showy and attractive, often used for clothes." },

        // Grammar: Present Simple vs Present Continuous (13-20)
        { id: 13, type: 'grammar', question: "Listen! The birds ______ in the garden.", options: ["are singing", "sing", "sang", "have sung"], answer: "are singing", explanation: "'Listen!' indicates an action happening right now -> Present Continuous." },
        { id: 14, type: 'grammar', question: "My mother ______ yoga every morning to stay healthy.", options: ["does", "is doing", "do", "done"], answer: "does", explanation: "'Every morning' indicates a habit/routine -> Present Simple." },
        { id: 15, type: 'grammar', question: "I ______ that you are absolutely right about this matter.", options: ["believe", "am believing", "believed", "believes"], answer: "believe", explanation: "'Believe' is a stative verb, rarely used in continuous form." },
        { id: 16, type: 'grammar', question: "He ______ always ______ about his homework! It's so annoying.", options: ["is / complaining", "does / complain", "was / complaining", "has / complained"], answer: "is / complaining", explanation: "Present Continuous with 'always' expresses annoyance at a repeated action." },
        { id: 17, type: 'grammar', question: "This soup ______ delicious. Can I have the recipe?", options: ["tastes", "is tasting", "taste", "tasted"], answer: "tastes", explanation: "Stative verb 'taste' describing a quality/state -> Present Simple." },
        { id: 18, type: 'grammar', question: "We ______ a party next Saturday. Would you like to come?", options: ["are having", "have", "had", "will have"], answer: "are having", explanation: "Present Continuous for a fixed future arrangement." },
        { id: 19, type: 'grammar', question: "The sun ______ in the east and sets in the west.", options: ["rises", "is rising", "rose", "rise"], answer: "rises", explanation: "General truth/scientific fact -> Present Simple." },
        { id: 20, type: 'grammar', question: "She ______ of buying a new car, but she hasn't decided yet.", options: ["is thinking", "thinks", "thought", "think"], answer: "is thinking", explanation: "'Think' meaning 'consider' is a dynamic verb -> Present Continuous." },

        // Synonyms (21-25)
        { id: 21, type: 'synonym', question: "CLOSEST meaning: My parents are very **strict** about my study schedule.", options: ["firm", "easy", "gentle", "relaxed"], answer: "firm", explanation: "Strict means demanding that rules be obeyed, similar to firm." },
        { id: 22, type: 'synonym', question: "CLOSEST meaning: We need to bridge the **generation gap**.", options: ["distance", "connection", "link", "similarity"], answer: "distance", explanation: "Gap refers to a space or distance between things." },
        { id: 23, type: 'synonym', question: "CLOSEST meaning: His **viewpoint** on this matter is different from mine.", options: ["perspective", "sight", "look", "vision"], answer: "perspective", explanation: "Viewpoint means a particular attitude or way of considering a matter (perspective)." },
        { id: 24, type: 'synonym', question: "CLOSEST meaning: Teenagers want to make their own **decisions**.", options: ["choices", "rules", "laws", "orders"], answer: "choices", explanation: "Making a decision involves making a choice." },
        { id: 25, type: 'synonym', question: "CLOSEST meaning: It's important to show **respect** to older people.", options: ["regard", "dislike", "anger", "rudeness"], answer: "regard", explanation: "Respect means a feeling of deep admiration or high regard." },

        // Antonyms (26-30)
        { id: 26, type: 'antonym', question: "OPPOSITE meaning: She is a very **independent** girl.", options: ["dependent", "free", "strong", "active"], answer: "dependent", explanation: "Independent means not relying on others; dependent is the opposite." },
        { id: 27, type: 'antonym', question: "OPPOSITE meaning: My grandparents hold **conservative** views.", options: ["progressive", "traditional", "old", "ancient"], answer: "progressive", explanation: "Conservative means holding to traditional values; progressive favors change/modern ideas." },
        { id: 28, type: 'antonym', question: "OPPOSITE meaning: The **conflict** between them ended yesterday.", options: ["harmony", "fight", "war", "battle"], answer: "harmony", explanation: "Conflict is disagreement; harmony is agreement and peace." },
        { id: 29, type: 'antonym', question: "OPPOSITE meaning: The family structure has changed from **extended** to nuclear.", options: ["nuclear", "large", "big", "huge"], answer: "nuclear", explanation: "Extended family (large) vs Nuclear family (small/core)." },
        { id: 30, type: 'antonym', question: "OPPOSITE meaning: His clothes are too **flashy** for school.", options: ["plain", "colorful", "bright", "expensive"], answer: "plain", explanation: "Flashy means showy/ostentatious; plain means simple/unadorned." }
      ]
    }
  ]
};

export const UNIT2_PRACTICE_TEST: PracticeTestData = {
  module_id: "u2_practice_test",
  title: "Unit 2: Elite Challenge",
  unit_context: "Unit 2: Vietnam and ASEAN",
  type: "gamified_test",
  total_questions: 30,
  time_limit_minutes: 30,
  description: "Comprehensive Assessment: Vocabulary, Past Tenses, Cleft Sentences.",
  sections: [
    {
      section_name: "Vocabulary & Grammar Mastery",
      questions: [
        { id: 1, type: 'multiple_choice', question: "The scenery of Ha Long Bay was so beautiful that it took my breath ________.", options: ["off", "out", "away", "up"], answer: "away", explanation: "Idiom 'take someone's breath away' means to be extremely beautiful or surprising." },
        { id: 2, type: 'multiple_choice', question: "When they opened the ________, they discovered ancient treasures inside.", options: ["palace", "cathedral", "tomb", "pagoda"], answer: "tomb", explanation: "A tomb is where people are buried, often with treasures in ancient times." },
        { id: 3, type: 'multiple_choice', question: "One Pillar Pagoda is not only a place of ________ but also a symbol of Hanoi.", options: ["travel", "worship", "culture", "architecture"], answer: "worship", explanation: "A pagoda is a religious place for worship." },
        { id: 4, type: 'multiple_choice', question: "They camped at the base of the ________ before climbing to the top.", options: ["cave", "valley", "mountain", "dune"], answer: "mountain", explanation: "You climb from the base to the top of a mountain." },
        { id: 5, type: 'multiple_choice', question: "Ban Gioc is one of the most famous ________ in Vietnam.", options: ["mountains", "valleys", "waterfalls", "dunes"], answer: "waterfalls", explanation: "Ban Gioc is a well-known waterfall on the border." },
        { id: 6, type: 'multiple_choice', question: "Ha Long Bay is a popular tourist ________ for international visitors.", options: ["attraction", "architecture", "worship", "tradition"], answer: "attraction", explanation: "Collocation: 'tourist attraction'." },
        { id: 7, type: 'multiple_choice', question: "Hue Imperial City is a ________ site with great cultural value.", options: ["modern", "historic", "narrow", "crowded"], answer: "historic", explanation: "'Historic' means important in history." },
        { id: 8, type: 'multiple_choice', question: "The Old Quarter is famous for its ________ streets and ancient houses.", options: ["modern", "narrow", "picturesque", "mountainous"], answer: "narrow", explanation: "The Old Quarter is characterized by its 36 narrow streets." },
        { id: 9, type: 'multiple_choice', question: "Hoi An Ancient Town is well-known for its traditional ________.", options: ["crowd", "architecture", "worship", "attraction"], answer: "architecture", explanation: "Hoi An is famous for its preserved ancient architecture." },
        { id: 10, type: 'multiple_choice', question: "The sand ________ in Mui Ne attract many tourists every year.", options: ["caves", "valleys", "dunes", "waterfalls"], answer: "dunes", explanation: "Mui Ne is famous for its red and white sand dunes." },
        { id: 11, type: 'grammar', question: "I __________ a lot of photos while I was visiting Trang An Scenic Landscape.", options: ["take", "took", "was taking", "have taken"], answer: "took", explanation: "Past Simple 'took' describes the completed actions during the visit." },
        { id: 12, type: 'grammar', question: "When I was a child, my family often ________ to the countryside for holidays.", options: ["go", "went", "was going", "had gone"], answer: "went", explanation: "Past Simple 'went' is used for past habits with 'often'." },
        { id: 13, type: 'grammar', question: "While we ________ the cave, it suddenly started to rain heavily.", options: ["explored", "were exploring", "explore", "had explored"], answer: "were exploring", explanation: "Past Continuous 'were exploring' for an action in progress interrupted by another." },
        { id: 14, type: 'grammar', question: "At this time yesterday, we ________ sightseeing in Hue Imperial City.", options: ["are", "were", "was", "have been"], answer: "were", explanation: "'At this time yesterday' requires Past Continuous. 'We were sightseeing'." },
        { id: 15, type: 'grammar', question: "She ________ her ankle while she was climbing the mountain.", options: ["twists", "twisted", "was twisting", "has twisted"], answer: "twisted", explanation: "Past Simple 'twisted' for a sudden action interrupting a longer one." },
        { id: 16, type: 'grammar', question: "This temple ________ very peaceful in the early morning.", options: ["is feeling", "feels", "felt", "was feeling"], answer: "feels", explanation: "Stative/Linking verb 'feels' in Present Simple to describe a state/fact." },
        { id: 17, type: 'grammar', question: "The soup ________ delicious when we ate at the street stall.", options: ["is tasting", "tastes", "tasted", "was tasting"], answer: "tasted", explanation: "Linking verb 'tasted' in Past Simple because of 'when we ate'." },
        { id: 18, type: 'grammar', question: "I ________ what you mean about preserving historical sites.", options: ["am seeing", "see", "saw", "was seeing"], answer: "see", explanation: "'See' meaning 'understand' is a stative verb, not used in continuous forms." },
        { id: 19, type: 'grammar', question: "The ancient city ________ more crowded during the festival.", options: ["becomes", "is becoming", "became", "was becoming"], answer: "became", explanation: "Past Simple 'became' describes a completed change in the past context." },
        { id: 20, type: 'grammar', question: "This pagoda ________ an important religious place in the past.", options: ["is", "was", "has been", "is being"], answer: "was", explanation: "'In the past' indicates Past Simple." },
        { id: 21, type: 'grammar', question: "It was Ha Long Bay ________ impressed me the most.", options: ["that", "where", "who", "when"], answer: "that", explanation: "Cleft sentence structure: It was [Object] that [Verb]..." },
        { id: 22, type: 'grammar', question: "It was at the temple ________ we learned about local traditions.", options: ["which", "that", "who", "where"], answer: "that", explanation: "Cleft sentence emphasizing a prepositional phrase uses 'that'." },
        { id: 23, type: 'grammar', question: "It was the tourists ________ took photos of the ancient architecture.", options: ["which", "where", "who", "when"], answer: "who", explanation: "Cleft sentence emphasizing people uses 'who' or 'that'." },
        { id: 24, type: 'grammar', question: "It was the palace ________ they visited during the tour.", options: ["who", "where", "that", "when"], answer: "that", explanation: "Cleft sentence emphasizing object uses 'that'." },
        { id: 25, type: 'grammar', question: "It was last summer ________ we traveled to Ninh Binh.", options: ["that", "which", "where", "who"], answer: "that", explanation: "Cleft sentence emphasizing time uses 'that'." },
        { id: 26, type: 'synonym', question: "The word **picturesque** is closest in meaning to ________.", options: ["crowded", "modern", "beautiful", "narrow"], answer: "beautiful", explanation: "Picturesque means visually attractive, like a picture." },
        { id: 27, type: 'antonym', question: "The opposite of **crowded** is ________.", options: ["narrow", "deserted", "historic", "traditional"], answer: "deserted", explanation: "Deserted means empty of people, opposite of crowded." },
        { id: 28, type: 'multiple_choice', question: "The word **historic** refers to something that ________.", options: ["is very old", "has historical importance", "is traditional", "looks ancient"], answer: "has historical importance", explanation: "Historic means famous or important in history." },
        { id: 29, type: 'multiple_choice', question: "A **citadel** is best described as a ________.", options: ["place of worship", "large natural cave", "fortified area", "tourist market"], answer: "fortified area", explanation: "A citadel is a fortress used to protect a city." },
        { id: 30, type: 'multiple_choice', question: "A **tourist attraction** is a place that ________.", options: ["people worship", "people live", "tourists visit", "people study"], answer: "tourists visit", explanation: "Definition of tourist attraction." }
      ]
    }
  ]
};

export const UNIT3_PRACTICE_TEST: PracticeTestData = { 
  module_id: "u3_practice_test", 
  title: "Unit 3: Elite Challenge", 
  unit_context: "Unit 3: Global Warming", 
  type: "gamified_test", 
  total_questions: 10, 
  time_limit_minutes: 15, 
  description: "Ecosystems and Present Perfect.", 
  sections: [
    {
      section_name: "Environment Protection",
      questions: [
        { id: 1, type: 'multiple_choice', question: "Carbon dioxide is a major ______ gas causing global warming.", options: ["clean", "greenhouse", "oxygen", "rare"], answer: "greenhouse", explanation: "Greenhouse gases trap heat in the atmosphere." },
        { id: 2, type: 'multiple_choice', question: "______ leads to the loss of natural habitats for many animals.", options: ["Reforestation", "Deforestation", "Gardening", "Planting"], answer: "Deforestation", explanation: "Deforestation is the mass removal of trees." },
        { id: 3, type: 'multiple_choice', question: "We can reduce our ______ footprint by using public transport.", options: ["water", "carbon", "sand", "energy"], answer: "carbon", explanation: "Carbon footprint measures environmental impact." },
        { id: 4, type: 'multiple_choice', question: "Burning ______ fuels releases harmful emissions into the air.", options: ["solar", "renewable", "fossil", "clean"], answer: "fossil", explanation: "Fossil fuels include coal, oil, and gas." },
        { id: 5, type: 'multiple_choice', question: "Solar and wind power are clean sources of ______ energy.", options: ["non-renewable", "limited", "renewable", "dirty"], answer: "renewable", explanation: "Renewable energy comes from inexhaustible sources." },
        { id: 6, type: 'multiple_choice', question: "Many factories are trying to cut down their toxic ______.", options: ["emissions", "products", "workers", "costs"], answer: "emissions", explanation: "Emissions are gases released into the atmosphere." },
        { id: 7, type: 'multiple_choice', question: "Global ______ is causing the polar ice caps to melt.", options: ["cooling", "warming", "freezing", "shifting"], answer: "warming", explanation: "Global warming is the rise in Earth's temperature." },
        { id: 8, type: 'multiple_choice', question: "Severe floods are one of the ______ of climate change.", options: ["causes", "solutions", "consequences", "benefits"], answer: "consequences", explanation: "Consequences are the results or outcomes." },
        { id: 9, type: 'multiple_choice', question: "Pollution can destroy the delicate balance of an ______.", options: ["economy", "ecosystem", "education", "election"], answer: "ecosystem", explanation: "An ecosystem is a community of interacting organisms." },
        { id: 10, type: 'multiple_choice', question: "Livestock farming produces a significant amount of ______.", options: ["oxygen", "methane", "water", "nitrogen"], answer: "methane", explanation: "Methane is a potent greenhouse gas from livestock." }
      ]
    }
  ] 
};

export const UNIT4_PRACTICE_TEST: PracticeTestData = { 
  module_id: "u4_practice_test", 
  title: "Unit 4: Elite Challenge", 
  unit_context: "Unit 4: World Heritage", 
  type: "gamified_test", 
  total_questions: 10, 
  time_limit_minutes: 15, 
  description: "Preservation and Conjunctions.", 
  sections: [
    {
      section_name: "Heritage Preservation",
      questions: [
        { id: 1, type: 'multiple_choice', question: "Ha Long Bay is a famous World ______ Site in Vietnam.", options: ["Park", "Heritage", "View", "History"], answer: "Heritage", explanation: "World Heritage Sites are recognized for universal value." },
        { id: 2, type: 'multiple_choice', question: "The ______ of historic buildings is vital for our culture.", options: ["destruction", "preservation", "neglect", "sale"], answer: "preservation", explanation: "Preservation means protecting and keeping safe." },
        { id: 3, type: 'multiple_choice', question: "Quan Ho singing is part of our ______ cultural heritage.", options: ["tangible", "intangible", "solid", "material"], answer: "intangible", explanation: "Intangible heritage includes traditions and oral expressions." },
        { id: 4, type: 'multiple_choice', question: "The ______ of the ancient gate was completed last year.", options: ["restoration", "building", "moving", "breaking"], answer: "restoration", explanation: "Restoration is the act of repairing or returning to original state." },
        { id: 5, type: 'multiple_choice', question: "I admire the unique ______ of the Imperial Citadel.", options: ["painting", "architecture", "food", "clothes"], answer: "architecture", explanation: "Architecture refers to the design and style of buildings." },
        { id: 6, type: 'multiple_choice', question: "My Son Sanctuary is an important ______ site.", options: ["modern", "archaeological", "industrial", "empty"], answer: "archaeological", explanation: "Archaeological sites hold physical remains of the past." },
        { id: 7, type: 'multiple_choice', question: "Trang An is famous for its stunning limestone ______.", options: ["city", "landscape", "road", "factory"], answer: "landscape", explanation: "Landscape refers to visible features of land." },
        { id: 8, type: 'multiple_choice', question: "The Thang Long Imperial ______ is located in the heart of Hanoi.", options: ["Tower", "Citadel", "Bridge", "Gate"], answer: "Citadel", explanation: "A citadel is a fortress dominating a city." },
        { id: 9, type: 'multiple_choice', question: "Vietnam has many traditional styles of ______ singing.", options: ["pop", "rock", "folk", "rap"], answer: "folk", explanation: "Folk singing originates in traditional culture." },
        { id: 10, type: 'multiple_choice', question: "UNESCO ______ sites with outstanding universal value.", options: ["forgets", "recognizes", "buys", "sells"], answer: "recognizes", explanation: "Recognize means to identify and acknowledge officially." }
      ]
    }
  ] 
};

export const UNIT5_PRACTICE_TEST: PracticeTestData = { module_id: "u5_practice_test", title: "Unit 5: Elite Challenge", unit_context: "Unit 5: Cities of the Future", type: "gamified_test", total_questions: 0, time_limit_minutes: 15, description: "Structure Placeholder", sections: [] };
export const UNIT6_PRACTICE_TEST: PracticeTestData = { module_id: "u6_practice_test", title: "Unit 6: Elite Challenge", unit_context: "Unit 6: Social Issues", type: "gamified_test", total_questions: 0, time_limit_minutes: 15, description: "Structure Placeholder", sections: [] };
export const UNIT7_PRACTICE_TEST: PracticeTestData = { module_id: "u7_practice_test", title: "Unit 7: Elite Challenge", unit_context: "Unit 7: Healthy Lifestyle", type: "gamified_test", total_questions: 0, time_limit_minutes: 15, description: "Structure Placeholder", sections: [] };
export const UNIT8_PRACTICE_TEST: PracticeTestData = { module_id: "u8_practice_test", title: "Unit 8: Elite Challenge", unit_context: "Unit 8: Health & Life", type: "gamified_test", total_questions: 0, time_limit_minutes: 15, description: "Structure Placeholder", sections: [] };

// ==========================================
// ERROR CORRECTION
// ==========================================

export const UNIT1_ERROR_CORRECTION: ErrorCorrectionData = {
  module_id: "u1_error",
  title: "Unit 1: Error Lab",
  description: "Identify family life grammar errors.",
  questions: [
    { id: 1, sentence: "My parents [A] is [B] very [C] strict [D] with me.", error_part: "A", correction: "are", explanation: "Plural subject 'parents' requires the verb 'are' in the present tense." },
    { id: 2, sentence: "I [A] am knowing [B] that [C] you want [D] privacy.", error_part: "A", correction: "know", explanation: "'Know' is a stative verb and is rarely used in the continuous form." }
  ]
};

export const UNIT2_ERROR_CORRECTION: ErrorCorrectionData = { module_id: "u2_error", title: "Unit 2: Error Lab", description: "Identify ASEAN and past tense errors.", questions: [] };
export const UNIT3_ERROR_CORRECTION: ErrorCorrectionData = { module_id: "u3_error", title: "Unit 3: Error Lab", description: "Identify global warming grammar errors.", questions: [] };
export const UNIT4_ERROR_CORRECTION: ErrorCorrectionData = { module_id: "u4_error", title: "Unit 4: Error Lab", description: "Identify heritage and conjunction errors.", questions: [] };

export const UNIT5_ERROR_CORRECTION: ErrorCorrectionData = {
  module_id: "u5_error",
  title: "Unit 5: Error Lab",
  description: "Identify future forms errors.",
  questions: [
    {
      id: 1,
      sentence: "[A] In the future , people [B] will to use [C] flying vehicles to [D] reduce traffic congestion.",
      error_part: "B",
      correction: "will use",
      explanation: "Sửa thành: 'will use'. Sau 'will' là động từ nguyên mẫu không 'to'."
    },
    {
      id: 2,
      sentence: "[A] Look at [B] that drone ! It [C] will going to land [D] on the roof .",
      error_part: "C",
      correction: "is going to land",
      explanation: "Sửa thành: 'is going to land'. Dùng 'be going to' cho dự đoán có căn cứ hiện tại."
    }
  ]
};

export const UNIT6_ERROR_CORRECTION: ErrorCorrectionData = { module_id: "u6_error", title: "Unit 6: Error Lab", description: "Identify linking words errors.", questions: [] };
export const UNIT7_ERROR_CORRECTION: ErrorCorrectionData = { module_id: "u7_error", title: "Unit 7: Error Lab", description: "Identify modals errors.", questions: [] };
export const UNIT8_ERROR_CORRECTION: ErrorCorrectionData = { module_id: "u8_error", title: "Unit 8: Error Lab", description: "Identify reported speech errors.", questions: [] };

// ==========================================
// GRAMMAR CHALLENGES
// ==========================================

export const UNIT1_GRAMMAR_CHALLENGE: GrammarChallengeData = {
  module_id: "u1_challenge",
  title: "Unit 1: Grammar Master",
  unit_context: "Unit 1",
  description: "Master present tenses and stative verbs.",
  total_questions: 15,
  questions: [
    { id: 1, type: 'multiple_choice', question: "He ______ always using my phone without asking! It's so annoying.", options: ["is", "does", "was", "has"], answer: "is", explanation: "Use present continuous with 'always' to express a complaint about a frequent habit." },
    { id: 2, type: 'multiple_choice', question: "I ______ that you want more privacy, but we are just worried about you.", options: ["am knowing", "know", "knows", "knowing"], answer: "know", explanation: "'Know' is a stative verb and is not used in the continuous form." },
    { id: 3, type: 'multiple_choice', question: "The school bus ______ at 7:30 AM every morning.", options: ["leaves", "is leaving", "leave", "has left"], answer: "leaves", explanation: "Use present simple for fixed schedules and timetables." },
    { id: 4, type: 'multiple_choice', question: "Why ______ at me like that? Is there something wrong with my hair?", options: ["do you look", "are you looking", "you look", "you are looking"], answer: "are you looking", explanation: "Use present continuous for an action happening at the moment of speaking." },
    { id: 5, type: 'multiple_choice', question: "My father ______ football every Sunday afternoon.", options: ["play", "plays", "is playing", "has played"], answer: "plays", explanation: "Present simple for a repeated habit." },
    { id: 6, type: 'multiple_choice', question: "This soup ______ delicious. What's in it?", options: ["smell", "is smelling", "smells", "smelling"], answer: "smells", explanation: "'Smell' is a stative verb describing a state." },
    { id: 7, type: 'multiple_choice', question: "I ______ about moving to a nuclear family setup.", options: ["think", "am thinking", "thinks", "thought"], answer: "am thinking", explanation: "'Think' can be used in continuous when it means 'considering'." },
    { id: 8, type: 'multiple_choice', question: "She ______ a new car to drive to her independent job.", options: ["has", "is having", "have", "had"], answer: "has", explanation: "'Have' is stative when expressing possession." },
    { id: 9, type: 'multiple_choice', question: "Do you ______ what the generation gap means?", options: ["understanding", "understand", "are understanding", "understands"], answer: "understand", explanation: "'Understand' is a stative verb." },
    { id: 10, type: 'multiple_choice', question: "We ______ dinner with our extended family right now.", options: ["have", "are having", "has", "had"], answer: "are having", explanation: "'Have' in continuous means 'eating' (dynamic)." },
    { id: 11, type: 'multiple_choice', question: "Water ______ at 100 degrees Celsius.", options: ["boil", "is boiling", "boils", "boiling"], answer: "boils", explanation: "Present simple for general truths." },
    { id: 12, type: 'multiple_choice', question: "You ______ always complaining about the curfew!", options: ["are", "is", "do", "have"], answer: "are", explanation: "Continuous with 'always' for annoyance." },
    { id: 13, type: 'multiple_choice', question: "I ______ the doctor tomorrow about my childcare duties.", options: ["see", "am seeing", "sees", "saw"], answer: "am seeing", explanation: "'See' in continuous for a planned future arrangement." },
    { id: 14, type: 'multiple_choice', question: "The cake ______ sweet.", options: ["taste", "is tasting", "tastes", "tasting"], answer: "tastes", explanation: "'Taste' is stative for describing quality." },
    { id: 15, type: 'multiple_choice', question: "They ______ to be more independent next year.", options: ["want", "are wanting", "wants", "wanted"], answer: "want", explanation: "'Want' is a stative verb." }
  ]
};

export const UNIT2_GRAMMAR_CHALLENGE: GrammarChallengeData = { 
  module_id: "u2_challenge", 
  title: "Unit 2: Grammar Master", 
  unit_context: "Unit 2", 
  description: "Master past tenses and cleft sentences.", 
  total_questions: 15, 
  questions: [
    { id: 1, type: 'multiple_choice', question: "It was my mother ______ taught me how to respect traditional values.", options: ["which", "who", "whom", "whose"], answer: "who", explanation: "In a cleft sentence emphasizing a person, use 'who' or 'that'." },
    { id: 2, type: 'multiple_choice', question: "While I ______ for the ASEAN quiz, the power suddenly went out.", options: ["studied", "was studying", "am studying", "were studying"], answer: "was studying", explanation: "Use past continuous for a background action interrupted by a shorter past action." },
    { id: 3, type: 'multiple_choice', question: "Vietnam ______ ASEAN as its 7th member in 1995.", options: ["joins", "joined", "was joining", "has joined"], answer: "joined", explanation: "Use past simple for a completed action at a specific time in the past." },
    { id: 4, type: 'multiple_choice', question: "It is in this historic room ______ the ASEAN Charter was signed.", options: ["which", "where", "that", "when"], answer: "that", explanation: "In a standard cleft sentence 'It is... that...', 'that' is the most common connector for emphasis." },
    { id: 5, type: 'multiple_choice', question: "The students ______ the classroom when the teacher arrived.", options: ["clean", "cleaned", "were cleaning", "had cleaned"], answer: "were cleaning", explanation: "Past continuous for an action in progress at a specific time." },
    { id: 6, type: 'multiple_choice', question: "It was in 1967 ______ ASEAN was founded.", options: ["which", "when", "that", "who"], answer: "that", explanation: "Cleft sentence structure emphasizing time." },
    { id: 7, type: 'multiple_choice', question: "I ______ in Hanoi for ten years before moving to Lam Dong.", options: ["live", "lived", "was living", "has lived"], answer: "lived", explanation: "Past simple for a finished duration in the past." },
    { id: 8, type: 'multiple_choice', question: "They ______ a movie when the news about the summit broke.", options: ["watch", "watched", "were watching", "watching"], answer: "were watching", explanation: "Past continuous for background action." },
    { id: 9, type: 'multiple_choice', question: "It is Vietnam ______ will host the next ASEAN meeting.", options: ["who", "which", "that", "whom"], answer: "that", explanation: "Cleft sentence emphasizing a country." },
    { id: 10, type: 'multiple_choice', question: "While I ______ dinner, the phone rang.", options: ["cooking", "cook", "was cooking", "cooked"], answer: "was cooking", explanation: "Past continuous for the longer action." },
    { id: 11, type: 'multiple_choice', question: "It was last month ______ we visited the Imperial Citadel.", options: ["when", "which", "that", "who"], answer: "that", explanation: "Cleft sentence structure." },
    { id: 12, type: 'multiple_choice', question: "I ______ the regional scholarship candidates yesterday.", options: ["see", "didn't see", "wasn't seeing", "haven't seen"], answer: "didn't see", explanation: "Past simple for negative completed action." },
    { id: 13, type: 'multiple_choice', question: "She ______ a book when she heard a strange noise outside.", options: ["is reading", "was reading", "read", "reads"], answer: "was reading", explanation: "Past continuous for background action." },
    { id: 14, type: 'multiple_choice', question: "It was the teacher ______ gave us the ASEAN quiz.", options: ["which", "who", "whom", "whose"], answer: "who", explanation: "In a cleft sentence emphasizing a person, use 'who' or 'that'." },
    { id: 15, type: 'multiple_choice', question: "Where ______ she during the cultural exchange program?", options: ["is", "was", "were", "did"], answer: "was", explanation: "Past simple of 'be' for singular subject." }
  ] 
};

export const UNIT3_GRAMMAR_CHALLENGE: GrammarChallengeData = { 
  module_id: "u3_challenge", 
  title: "Unit 3: Grammar Master", 
  unit_context: "Unit 3", 
  description: "Master present perfect vs past simple.", 
  total_questions: 15, 
  questions: [
    { id: 1, type: 'multiple_choice', question: "The volunteers ______ ten sea turtles so far this month.", options: ["saved", "have saved", "are saving", "save"], answer: "have saved", explanation: "Use present perfect with 'so far' to describe actions continuing up to now." },
    { id: 2, type: 'multiple_choice', question: "Last week, the local community ______ the whole beach.", options: ["cleaned", "has cleaned", "was cleaning", "clean"], answer: "cleaned", explanation: "Use past simple for actions completed at a specific time (last week)." },
    { id: 3, type: 'multiple_choice', question: "Since 2010, the Earth's temperature ______ significantly.", options: ["rose", "has risen", "is rising", "rises"], answer: "has risen", explanation: "Use present perfect with 'since' + point in time." },
    { id: 4, type: 'multiple_choice', question: "______ you ever ______ of the 'Great Pacific Garbage Patch'?", options: ["Did / hear", "Have / heard", "Do / hear", "Are / hearing"], answer: "Have / heard", explanation: "Use present perfect with 'ever' to ask about life experiences." },
    { id: 5, type: 'multiple_choice', question: "He ______ his homework already.", options: ["finished", "has finished", "is finishing", "finish"], answer: "has finished", explanation: "Present perfect with 'already'." },
    { id: 6, type: 'multiple_choice', question: "They ______ a new electric car two years ago.", options: ["bought", "have bought", "buy", "are buying"], answer: "bought", explanation: "Past simple for specific time 'two years ago'." },
    { id: 7, type: 'multiple_choice', question: "It ______ very hot so far this year.", options: ["is", "was", "has been", "be"], answer: "has been", explanation: "Present perfect with 'so far'." },
    { id: 8, type: 'multiple_choice', question: "I ______ to a tropical rainforest before.", options: ["never was", "have never been", "am never", "never went"], answer: "have never been", explanation: "Present perfect for life experience." },
    { id: 9, type: 'multiple_choice', question: "We ______ to the zoo yesterday to see the flora and fauna.", options: ["go", "went", "have gone", "gone"], answer: "went", explanation: "Past simple for 'yesterday'." },
    { id: 10, type: 'multiple_choice', question: "I ______ him for a long time.", options: ["know", "knew", "have known", "am knowing"], answer: "have known", explanation: "Present perfect with 'for' for duration up to now." },
    { id: 11, type: 'multiple_choice', question: "The delegates ______ at the climate conference just now.", options: ["arrived", "have just arrived", "arrive", "are arriving"], answer: "have just arrived", explanation: "Present perfect with 'just'." },
    { id: 12, type: 'multiple_choice', question: "They ______ a recycling program in 2005.", options: ["start", "started", "have started", "starting"], answer: "started", explanation: "Past simple for specific year." },
    { id: 13, type: 'multiple_choice', question: "She ______ the environmental report yet.", options: ["didn't finish", "hasn't finished", "doesn't finish", "not finish"], answer: "hasn't finished", explanation: "Present perfect with 'yet' in negative sentence." },
    { id: 14, type: 'multiple_choice', question: "It ______ since this morning.", options: ["rained", "has rained", "rains", "is raining"], answer: "has rained", explanation: "Present perfect for action starting in the past and continuing." },
    { id: 15, type: 'multiple_choice', question: "How many times ______ Ha Long Bay?", options: ["did you visit", "have you visited", "you visit", "do you visit"], answer: "have you visited", explanation: "Present perfect to ask about frequency of experience." }
  ] 
};

export const UNIT4_GRAMMAR_CHALLENGE: GrammarChallengeData = { 
  module_id: "u4_challenge", 
  title: "Unit 4: Grammar Master", 
  unit_context: "Unit 4", 
  description: "Master paired conjunctions and compound nouns.", 
  total_questions: 15, 
  questions: [
    { id: 1, type: 'multiple_choice', question: "______ his brother and his sister are famous historians.", options: ["Either", "Neither", "Both", "Not only"], answer: "Both", explanation: "Use 'Both... and' to connect two people or things." },
    { id: 2, type: 'multiple_choice', question: "Neither the teacher nor the students ______ prepared for the field trip.", options: ["is", "are", "was", "be"], answer: "are", explanation: "With 'Neither... nor', the verb agrees with the closer subject (students - plural)." },
    { id: 3, type: 'multiple_choice', question: "The old ______ on the cliff helps ships avoid the rocks.", options: ["light house", "lighthouse", "house light", "lighthousing"], answer: "lighthouse", explanation: "Lighthouse is the correct compound noun for a tower with a bright light." },
    { id: 4, type: 'multiple_choice', question: "He is ______ intelligent but also very creative.", options: ["either", "neither", "not only", "both"], answer: "not only", explanation: "The structure is 'not only... but also'." },
    { id: 5, type: 'multiple_choice', question: "Either you or he ______ responsible for the preservation project.", options: ["are", "is", "be", "am"], answer: "is", explanation: "With 'Either... or', the verb agrees with the closer subject (he - singular)." },
    { id: 6, type: 'multiple_choice', question: "We need to install new ______ to manage the museum's data.", options: ["soft ware", "software", "waresoft", "softs ware"], answer: "software", explanation: "Software is a common compound noun." },
    { id: 7, type: 'multiple_choice', question: "Both my father and my mother ______ archaeologists.", options: ["is", "are", "be", "was"], answer: "are", explanation: "'Both... and' always takes a plural verb." },
    { id: 8, type: 'multiple_choice', question: "Neither of the historical buildings ______ open to the public today.", options: ["are", "is", "be", "were"], answer: "is", explanation: "'Neither of' followed by a plural noun typically takes a singular verb in formal English." },
    { id: 9, type: 'multiple_choice', question: "The children are playing near the ______.", options: ["pool swimming", "swimming pool", "poolswim", "swimpool"], answer: "swimming pool", explanation: "Swimming pool is the correct compound noun order." },
    { id: 10, type: 'multiple_choice', question: "Not only ______ the monuments, but they also raised awareness.", options: ["did they restore", "they restored", "do they restore", "restored they"], answer: "did they restore", explanation: "Inversion is required after 'Not only' at the beginning of a clause." },
    { id: 11, type: 'multiple_choice', question: "His ______ is a very kind woman.", options: ["mother-in-law", "mother in law", "motherlaw", "mother-law"], answer: "mother-in-law", explanation: "Hyphenated compound noun." },
    { id: 12, type: 'multiple_choice', question: "The complex is ______ beautiful ______ historical.", options: ["both / or", "either / and", "both / and", "neither / or"], answer: "both / and", explanation: "Standard paired conjunction." },
    { id: 13, type: 'multiple_choice', question: "She likes ______ coffee ______ tea; she only drinks water.", options: ["neither / nor", "either / or", "both / and", "not only / but also"], answer: "neither / nor", explanation: "Negative choice between two options." },
    { id: 14, type: 'multiple_choice', question: "Please go to the ______ and get some rest.", options: ["room bed", "bedroom", "bed-room", "rooms bed"], answer: "bedroom", explanation: "Bedroom is a one-word compound noun." },
    { id: 15, type: 'multiple_choice', question: "You can choose ______ the ancient town ______ the citadel.", options: ["both / or", "either / or", "neither / and", "not only / or"], answer: "either / or", explanation: "Choice between two alternatives." }
  ] 
};

export const UNIT5_GRAMMAR_CHALLENGE: GrammarChallengeData = { module_id: "u5_challenge", title: "Unit 5: Grammar Master", unit_context: "Unit 5", description: "Structure Placeholder", total_questions: 0, questions: [] };
export const UNIT6_GRAMMAR_CHALLENGE: GrammarChallengeData = { module_id: "u6_challenge", title: "Unit 6: Grammar Master", unit_context: "Unit 6", description: "Structure Placeholder", total_questions: 0, questions: [] };
export const UNIT7_GRAMMAR_CHALLENGE: GrammarChallengeData = { module_id: "u7_challenge", title: "Unit 7: Grammar Master", unit_context: "Unit 7", description: "Structure Placeholder", total_questions: 0, questions: [] };
export const UNIT8_GRAMMAR_CHALLENGE: GrammarChallengeData = { module_id: "u8_challenge", title: "Unit 8: Grammar Master", unit_context: "Unit 8", description: "Structure Placeholder", total_questions: 0, questions: [] };

// ==========================================
// READING DATA
// ==========================================

export const UNIT1_READING_DATA: ReadingData = {
  module_id: "u1_reading",
  title: "Reading: Generation Gap",
  unit_context: "Unit 1: Generation Gap",
  reading_text: {
    title: "Bridging the Generation Gap",
    content: "The concept of the generation gap is a sociological phenomenon that describes the significant differences in opinions, values, attitudes, and behaviors between people of different age groups, most notably between parents and their children. In the rapidly evolving landscape of modern society, these intergenerational disparities often manifest as intense conflicts within the family unit.\n\nOne of the primary battlegrounds for these disagreements is lifestyle choices. Arguments frequently arise over issues such as fashion sense, musical preferences, and the enforcement of curfews. For instance, teenagers might prefer flashy clothing and loud music as expressions of their developing identity, whereas their parents might advocate for more traditional or modest styles. Similarly, while parents implement curfews to ensure safety, adolescents often view these restrictions as unnecessary barriers to their social lives.\n\nThese misunderstandings shape how each generation perceives the other. Teenagers often feel that their parents are excessively conservative and strict, unwilling to adapt to modern norms. Conversely, parents may feel that their children are becoming too independent and rebellious, disregarding the wisdom of experience.\n\nHowever, bridging this divide is entirely possible through the power of communication. Effective communication is not just about speaking but about listening without judgment. When family members make a conscious effort to listen to each other's viewpoints with empathy, they can develop a deeper mutual respect. Open communication serves as a bridge, allowing both sides to express their feelings and needs constructively. This process leads to stronger relationships and a more harmonious home environment. Ultimately, it is crucial for both parents and children to realize that despite their differences, they share common goals: the well-being of the family and a foundation of love."
  },
  tasks: [
    {
      task_id: "u1_r_t1",
      type: 'true_false',
      instruction: "Task 1: Decide if the following statements are True (T) or False (F).",
      questions: [
        { id: 1, question: "Generation gap happens only between teachers and students.", answer: false, explanation: "It typically happens between parents and children." },
        { id: 2, question: "Fashion is a common topic of conflict in many families.", answer: true, explanation: "The text mentions fashion as a lifestyle choice causing conflict." },
        { id: 3, question: "Parents always think their children are rebellious in every situation.", answer: false, explanation: "The text says they 'may' feel that way, not always." },
        { id: 4, question: "Listening without judging is a key to developing respect.", answer: true, explanation: "The text explicitly states this as a solution." }
      ]
    },
    {
      task_id: "u1_r_t2",
      type: 'fill_in_blanks',
      instruction: "Task 2: Complete the summary with one word from the text.",
      questions: [
        { id: 5, sentence: "The term ______ refers to differences between age groups.", answer: "generation gap", explanation: "Direct definition from first line.", hint: "g_ _ _ _ _ _ _ _ _  g_ _" },
        { id: 6, sentence: "Conflicts often occur over lifestyle ______ like music.", answer: "choices", explanation: "Mentioned in paragraph 2.", hint: "c_ _ _ _ _ _" },
        { id: 7, sentence: "Teenagers may view their parents as too ______.", answer: "conservative", explanation: "Found in line 3.", hint: "c_ _ _ _ _ _ _ _ _ _ _" },
        { id: 8, sentence: "Stronger ______ are built through open communication.", answer: "relationships", explanation: "The goal of communication mentioned in the text.", hint: "r_ _ _ _ _ _ _ _ _ _ _ _" }
      ]
    },
    {
      task_id: "u1_r_t3",
      type: 'multiple_choice',
      instruction: "Task 3: Choose the best answer for each comprehension question.",
      questions: [
        { id: 9, question: "What is the main theme of the text?", options: ["History of families", "Ways to bridge the generation gap", "Fashion trends", "Modern school systems"], answer: "Ways to bridge the generation gap", explanation: "The text focuses on solutions for family conflicts." },
        { id: 10, question: "Which is NOT mentioned as a source of conflict?", options: ["Fashion", "Curfews", "Music", "Food preferences"], answer: "Food preferences", explanation: "Food is not listed among lifestyle choices in the text." },
        { id: 11, question: "How do teenagers often perceive their parents?", options: ["Strict and conservative", "Funny and relaxed", "Wealthy", "Bored"], answer: "Strict and conservative", explanation: "The text mentions teens feel parents are too conservative and strict." },
        { id: 12, question: "What does 'judgment' mean in this context?", options: ["Legal ruling", "Evaluating someone's behavior unfairly", "Winning a prize", "Eating together"], answer: "Evaluating someone's behavior unfairly", explanation: "The context is about interpersonal understanding." },
        { id: 13, question: "Who should work on bridging the gap according to the text?", options: ["Only children", "Only parents", "Both parents and children", "Government officials"], answer: "Both parents and children", explanation: "The text says 'both sides' should realize they share goals." }
      ]
    }
  ]
};

export const UNIT2_READING_DATA: ReadingData = {
  module_id: "u2_reading",
  title: "Reading: Vietnam and ASEAN",
  unit_context: "Unit 2: Vietnam and ASEAN",
  reading_text: {
    title: "Solidarity in Southeast Asia",
    content: "Since officially joining the Association of Southeast Asian Nations (ASEAN) in July 1995, Vietnam has consistently demonstrated its commitment to being an active and responsible member of this regional organization. This milestone marked the beginning of a new era of integration and development for the country. Over the decades, Vietnam has contributed significantly to the region's overall economic growth and political stability, playing a pivotal role in maintaining peace and security in Southeast Asia.\n\nThrough various diplomatic and economic initiatives, Vietnam has vigorously promoted cultural exchange and multifaceted cooperation among member states. A cornerstone of this cooperation is adherence to the ASEAN Charter, which was adopted to provide a comprehensive legal framework for the bloc. This Charter sets out the rules, norms, and values that all members must follow, ensuring that the organization operates effectively and with respect for the sovereignty of each nation.\n\nThe charter emphasizes economic integration as a key goal, aiming to create a single market and production base that benefits all citizens. Furthermore, unity and solidarity are enshrined as core values of the organization. By celebrating the rich cultural diversity of its ten member states, ASEAN strengthens its unique regional identity and promotes mutual understanding among its peoples.\n\nThe success of the association depends heavily on the collective effort of all citizens to uphold these values. Whether through educational programs, youth exchanges, or economic partnerships, the goal remains the same: to maintain peace and stability in the region while fostering prosperity. As ASEAN continues to evolve, Vietnam's role remains central to building a cohesive community that is resilient in the face of global challenges."
  },
  tasks: [
    {
      task_id: "u2_r_t1",
      type: 'true_false',
      instruction: "Task 1: Decide if the statements are True or False.",
      questions: [
        { id: 1, question: "Vietnam joined ASEAN in 1995.", answer: true, explanation: "The text explicitly states this year." },
        { id: 2, question: "Solidarity is a core value of the organization.", answer: true, explanation: "The text identifies unity and solidarity as core values." },
        { id: 3, question: "The ASEAN Charter is just a non-binding map.", answer: false, explanation: "The text says it provides a 'legal framework'." },
        { id: 4, question: "Economic integration is not a goal of ASEAN.", answer: false, explanation: "Integration is mentioned as a key area of cooperation." }
      ]
    },
    {
      task_id: "u2_r_t2",
      type: 'fill_in_blanks',
      instruction: "Task 2: Complete the summary with one word from the text.",
      questions: [
        { id: 5, sentence: "Vietnam is an active and ______ member of ASEAN.", answer: "responsible", explanation: "Found in the first paragraph.", hint: "r_ _ _ _ _ _ _ _ _ _" },
        { id: 6, sentence: "The region aims for stability and ______.", answer: "growth", explanation: "Paragraph 1 mentions economic growth.", hint: "g_ _ _ _ _" },
        { id: 7, sentence: "Cultural ______ is promoted through various initiatives.", answer: "exchange", explanation: "Paragraph 2 mentions this promotion.", hint: "e_ _ _ _ _ _ _" },
        { id: 8, sentence: "Members follow the principles of the ASEAN ______.", answer: "Charter", explanation: "The Charter provides the framework.", hint: "C_ _ _ _ _ _" }
      ]
    },
    {
      task_id: "u2_r_t3",
      type: 'multiple_choice',
      instruction: "Task 3: Choose the best answer for each question.",
      questions: [
        { id: 9, question: "What is the main purpose of the text?", options: ["History of Vietnam", "Vietnam's role and ASEAN's unity", "Traveling in ASEAN", "Global wars"], answer: "Vietnam's role and ASEAN's unity", explanation: "The text covers membership and organizational values." },
        { id: 10, question: "What is a benefit of joining ASEAN mentioned?", options: ["Development and unity", "Cheaper food", "New languages", "Free cars"], answer: "Development and unity", explanation: "Integration and identity are highlighted." },
        { id: 11, question: "What provides the legal framework for members?", options: ["The Motto", "The Flag", "The ASEAN Charter", "The Map"], answer: "The ASEAN Charter", explanation: "Stated clearly in paragraph 2." },
        { id: 12, question: "What is the tone of the text?", options: ["Angry", "Sad", "Informative and positive", "Bored"], answer: "Informative and positive", explanation: "It lists achievements and positive values." },
        { id: 13, question: "What has Vietnam contributed to the region?", options: ["Stability", "Chaos", "Conflict", "Isolation"], answer: "Stability", explanation: "Mentioned alongside economic growth." }
      ]
    }
  ]
};

export const UNIT3_READING_DATA: ReadingData = {
  module_id: "u3_reading",
  title: "Reading: Global Warming",
  unit_context: "Unit 3: Global Warming",
  reading_text: {
    title: "The Warming Planet",
    content: "Global warming is widely considered one of the most pressing environmental challenges of the 21st century. It is primarily caused by the alarming increase of greenhouse gases in the Earth's atmosphere. These gases, which include carbon dioxide (CO2) and methane, act like a blanket, trapping heat from the sun and preventing it from escaping back into space. This process, known as the greenhouse effect, leads to steadily rising global temperatures.\n\nScientific consensus indicates that human activities are the main cause of this phenomenon. The burning of fossil fuels such as coal, oil, and gas for energy and transportation releases vast amounts of CO2. Additionally, deforestation plays a critical role; when forests are cleared for agriculture or urban development, the trees that act as carbon sinks are removed, further exacerbating the problem.\n\nThe consequences of global warming are severe and increasingly visible across the planet. Polar ice caps are melting at unprecedented rates, which directly causes sea levels to rise. This puts coastal communities and low-lying islands at risk of flooding and erosion. Furthermore, extreme weather events, including prolonged droughts, devastating floods, and intense storms, are becoming more frequent. These changes are disrupting ecosystems and leading to the loss of natural habitats for countless species, threatening global biodiversity.\n\nTo save our planet from irreversible damage, we must take immediate and decisive action. This involves a global transition to renewable energy sources like wind and solar power. on an individual level, we must strive to reduce our carbon footprint by making sustainable lifestyle choices. Simple actions, such as recycling waste, conserving electricity, and planting trees, can collectively make a significant difference. Protecting the environment is not just a choice but a necessity to ensure a habitable world for future generations."
  },
  tasks: [
    {
      task_id: "u3_r_t1",
      type: 'true_false',
      instruction: "Task 1: Decide if the statements are True or False.",
      questions: [
        { id: 1, question: "Methane is a type of greenhouse gas.", answer: true, explanation: "The text lists methane as a greenhouse gas." },
        { id: 2, question: "Global warming causes sea levels to fall.", answer: false, explanation: "It causes sea levels to 'rise'." },
        { id: 3, question: "Fossil fuels are considered renewable energy.", answer: false, explanation: "The text suggests transitioning 'away' from them to renewable sources." },
        { id: 4, question: "Deforestation helps reduce the greenhouse effect.", answer: false, explanation: "It is listed as a 'cause' of the problem." }
      ]
    },
    {
      task_id: "u3_r_t2",
      type: 'fill_in_blanks',
      instruction: "Task 2: Complete the summary with one word from the text.",
      questions: [
        { id: 5, sentence: "Burning ______ fuels releases harmful gases.", answer: "fossil", explanation: "Found in paragraph 2.", hint: "f_ _ _ _ _" },
        { id: 6, sentence: "Polar ice caps are ______ due to rising temperatures.", answer: "melting", explanation: "Found in paragraph 3.", hint: "m_ _ _ _ _ _" },
        { id: 7, sentence: "We must reduce our ______ footprint.", answer: "carbon", explanation: "Mentioned as a solution.", hint: "c_ _ _ _ _" },
        { id: 8, sentence: "Recycling helps protect the ______.", answer: "planet", explanation: "Mentioned in the concluding section.", hint: "p_ _ _ _ _" }
      ]
    },
    {
      task_id: "u3_r_t3",
      type: 'multiple_choice',
      instruction: "Task 3: Choose the correct answer.",
      questions: [
        { id: 9, question: "What is the main cause of global warming?", options: ["Solar cycles", "Human activities", "Volcanoes", "Ocean tides"], answer: "Human activities", explanation: "The text mentions fossil fuels and deforestation by humans." },
        { id: 10, question: "What is a result of melting ice caps?", options: ["Rising sea levels", "Colder summers", "New islands", "More oxygen"], answer: "Rising sea levels", explanation: "Stated in paragraph 3." },
        { id: 11, question: "What is one way mentioned to save the planet?", options: ["Planting trees", "Driving more", "Using coal", "Buying plastic"], answer: "Planting trees", explanation: "Listed in the final paragraph." },
        { id: 12, question: "Why is biodiversity at risk according to the text?", options: ["Loss of natural habitats", "Too much food", "Cold weather", "Lack of space"], answer: "Loss of natural habitats", explanation: "Disrupted ecosystems are mentioned." },
        { id: 13, question: "What traps heat in the air?", options: ["Oxygen", "Nitrogen", "Greenhouse gases", "Rain"], answer: "Greenhouse gases", explanation: "Explained in the first paragraph." }
      ]
    }
  ]
};

export const UNIT4_READING_DATA: ReadingData = {
  module_id: "u4_reading",
  title: "Reading: World Heritage",
  unit_context: "Unit 4: World Heritage",
  reading_text: {
    title: "Preserving Our Legacy",
    content: "World Heritage Sites are landmarks or areas selected by UNESCO as having outstanding universal value to humanity. These sites belong to all the peoples of the world, irrespective of the territory on which they are located. Vietnam is proud to be home to several UNESCO-recognized sites, ranging from the spectacular natural seascape of Ha Long Bay to the historic Complex of Hue Monuments and the charming Hoi An Ancient Town.\n\nPreserving these sites is essential for protecting our shared history and maintaining our unique cultural identity. They serve as tangible links to our past, offering insights into the civilizations and natural processes that have shaped our world. However, these irreplaceable treasures face a multitude of threats in the modern era. Natural disasters, such as harsh weather conditions, floods, and erosion, pose constant risks to physical structures and landscapes. Additionally, the impact of mass tourism can be detrimental; unchecked visitor numbers can lead to pollution, physical wear and tear, and the disruption of local ecosystems. For instance, marine ecosystems in sites like Ha Long Bay face threats from overfishing and climate change.\n\nWithout proper maintenance and care, magnificent buildings and monuments can deteriorate and turn into ruins over time. Therefore, effective restoration projects are key to safeguarding these sites. Such projects must be carefully managed to preserve the authenticity of the architecture and the integrity of the natural environment.\n\nBeyond government action, local awareness plays a vital role. Individuals must be educated about the value of heritage and the importance of responsible behavior. We must raise awareness among both locals and tourists to ensure that these treasures are treated with respect. Ultimately, protecting our heritage is a duty we owe to future generations, ensuring they too can appreciate the beauty and history of the past."
  },
  tasks: [
    {
      task_id: "u4_r_t1",
      type: 'true_false',
      instruction: "Task 1: Decide if the statements are True or False.",
      questions: [
        { id: 1, question: "UNESCO recognizes sites of universal value.", answer: true, explanation: "Stated in the first sentence." },
        { id: 2, question: "Mass tourism is always beneficial for heritage.", answer: false, explanation: "It is listed as a 'threat'." },
        { id: 3, question: "Restoration projects help preserve authenticity.", answer: true, explanation: "The text links restoration to passing treasures down." },
        { id: 4, question: "Only natural sites can be world heritage.", answer: false, explanation: "Cultural sites like citadels are also mentioned." }
      ]
    },
    {
      task_id: "u4_r_t2",
      type: 'fill_in_blanks',
      instruction: "Task 2: Complete the summary with one word from the text.",
      questions: [
        { id: 5, sentence: "Heritage sites connect us to our history and ______.", answer: "identity", explanation: "Found in paragraph 2.", hint: "i_ _ _ _ _ _ _" },
        { id: 6, sentence: "Magnificent buildings can turn into ______ over time.", answer: "ruins", explanation: "Mentioned as a threat of neglect.", hint: "r_ _ _ _" },
        { id: 7, sentence: "We must ______ awareness about site preservation.", answer: "raise", explanation: "Solution for individuals.", hint: "r_ _ _ _" },
        { id: 8, sentence: "Natural ______ like harsh weather threaten sites.", answer: "disasters", explanation: "Found in line 5.", hint: "d_ _ _ _ _ _ _ _" }
      ]
    },
    {
      task_id: "u4_r_t3",
      type: 'multiple_choice',
      instruction: "Task 3: Choose the best answer.",
      questions: [
        { id: 9, question: "What is an example of a cultural site in Vietnam?", options: ["Ha Long Bay", "The Hue Monuments", "The Red River", "Ba Na Hills"], answer: "The Hue Monuments", explanation: "Ha Long Bay is primarily natural; Hue is cultural." },
        { id: 10, question: "What threat is mentioned regarding marine ecosystems?", options: ["Overfishing and climate change", "New species", "Cold water", "Sunlight"], answer: "Overfishing and climate change", explanation: "Contextual threat for sites." },
        { id: 11, question: "Why is preservation important?", options: ["Passing treasures to future generations", "Making money", "Killing time", "Building hotels"], answer: "Passing treasures to future generations", explanation: "Core goal mentioned in text." },
        { id: 12, question: "What is the role of individuals in preservation?", options: ["Raising awareness", "Building citadels", "Selling tickets", "Cleaning the ocean"], answer: "Raising awareness", explanation: "Specifically mentioned in the text." },
        { id: 13, question: "What is the goal of restoration?", options: ["Destroying the past", "Safeguarding authentic architecture", "Making things new", "Moving buildings"], answer: "Safeguarding authentic architecture", explanation: "Implied by 'ensuring treasures are passed down'." }
      ]
    }
  ]
};

export const UNIT5_READING_DATA: ReadingData = { module_id: "u5_reading", title: "Reading: Future Cities", unit_context: "Unit 5", reading_text: { title: "Smart Cities", content: "Content coming soon..." }, tasks: [] };
export const UNIT6_READING_DATA: ReadingData = { module_id: "u6_reading", title: "Reading: Social Issues", unit_context: "Unit 6", reading_text: { title: "Community Problems", content: "Content coming soon..." }, tasks: [] };
export const UNIT7_READING_DATA: ReadingData = { module_id: "u7_reading", title: "Reading: Healthy Living", unit_context: "Unit 7", reading_text: { title: "Health Tips", content: "Content coming soon..." }, tasks: [] };
export const UNIT8_READING_DATA: ReadingData = { module_id: "u8_reading", title: "Reading: Life Expectancy", unit_context: "Unit 8", reading_text: { title: "Living Longer", content: "Content coming soon..." }, tasks: [] };

// ==========================================
// LISTENING DATA (RESTORED & UPGRADED)
// ==========================================

export const UNIT1_LISTENING_DATA: ListeningData = {
  module_id: "u1_listening",
  title: "Listening: Generation Gap",
  unit_context: "Unit 1: Generation Gap",
  audio_source: "", // Triggers AI Generation
  transcript: {
    title: "The Changing Face of Family: Understanding the Generation Gap",
    speakers: ["Sarah (Host)", "Dr. Alan Grant (Family Psychologist)"],
    content: `[Sarah]: Good morning, everyone, and welcome back to "Family Matters." I'm your host, Sarah, and today we are diving into a topic that touches almost every household: the Generation Gap. It’s that invisible barrier that sometimes makes parents and children feel like they are living on different planets. Joining me today to unpack this complex issue is Dr. Alan Grant, a renowned family psychologist and author of "Bridging the Divide." Welcome, Dr. Grant.

[Dr. Alan]: Thank you, Sarah. It’s a pleasure to be here. This is indeed a fascinating time to discuss family dynamics.

[Sarah]: To start off, Dr. Grant, could you define what we really mean by "Generation Gap"? Is it just about age?

[Dr. Alan]: That’s a great starting point. While age is the defining factor, the "gap" itself refers to the difference in attitudes, values, behaviors, and tastes between younger and older generations. It’s not just that a father is 40 and his son is 15; it’s that the world the father grew up in—without smartphones, social media, or instant global connectivity—is fundamentally different from the digital native environment of his son. This creates distinct worldviews.

[Sarah]: Absolutely. I see this in my own family. We often hear about "nuclear families" versus "extended families." How does family structure play into this?

[Dr. Alan]: Historically, particularly in Asian cultures like Vietnam, the extended family was the norm. You had grandparents, parents, and children all under one roof. This fostered close bonds but also required strict adherence to hierarchy and traditional values. Today, urbanization has led to the rise of the nuclear family—just parents and children. While this allows for more independence and privacy, which teenagers crave, it can also lead to a sense of isolation and a loss of that intergenerational wisdom. The gap widens when the support system of grandparents isn't there to mediate.

[Sarah]: That’s interesting. You mentioned independence. It seems like a major source of conflict. What are the most common battlegrounds we see today?

[Dr. Alan]: You hit the nail on the head. Independence is the core struggle. Teenagers are in a developmental phase where they need to establish their own identity. This often manifests in conflicts over three main areas: lifestyle choices, career paths, and technology. For instance, parents might enforce a strict curfew or dress code—thinking of safety and propriety—while teens view this as an infringement on their freedom and self-expression. They might want to dye their hair or wear "flashy" clothes, which conservative parents find inappropriate.

[Sarah]: And career choices?

[Dr. Alan]: Oh, that's a big one. Many parents, wanting stability for their children, push for traditional careers like medicine or engineering. They want their children to follow in their footsteps or achieve what they couldn't. However, the modern economy offers careers that didn't exist twenty years ago—influencers, game developers, digital nomads. When a child says they want to be a YouTuber, a parent might interpret that as being "lazy" or unrealistic, leading to intense conflict.

[Sarah]: And I assume technology is the third major wedge?

[Dr. Alan]: Without a doubt. We call it the "digital divide." Parents often see screen time as wasted time or addiction. Teens see it as their primary mode of socialization and learning. This misunderstanding breeds resentment. Parents feel ignored, and teens feel judged.

[Sarah]: So, is it hopeless? How do we bridge this gap?

[Dr. Alan]: Not at all. It requires effort from both sides. Communication is the most vital tool. But I don't mean just talking; I mean active listening. Parents need to listen to their children's viewpoints without immediately judging or imposing their own will. They should try to understand the "why" behind the behavior. Conversely, children need to understand that their parents' strictness usually comes from a place of love and concern, not malice.

[Sarah]: You talk about "table manners" in your book as a microcosm of this.

[Dr. Alan]: Yes! The dinner table is often where cultures clash. Elders expect formal table manners as a sign of respect. Teens might be used to casual eating or checking their phones. A simple compromise—like a "no phones at dinner" rule that applies to *everyone*, including parents—can create a shared space for connection rather than correction.

[Sarah]: Dr. Grant, we have some questions from our listeners regarding the long-term effects. One listener asks: "Is the generation gap strictly negative?"

[Dr. Alan]: That is a profound question. The answer is no. While it causes conflict, the generation gap is also a driver of progress. The younger generation brings innovation, new perspectives on social justice, and adaptability. The older generation brings wisdom, experience, and stability. When these two forces collaborate rather than collide, society evolves positively. The goal isn't to eliminate the gap—differences are natural—but to build bridges across it.

[Sarah]: Finally, for our student listeners who are trying to navigate this right now, what is your primary advice?

[Dr. Alan]: My advice is to practice empathy. For the teenagers listening: realize your parents are navigating a world that is changing faster than they can keep up with. Be patient with them. And for the parents: trust the values you've instilled in your children, and give them the space to make their own mistakes. Trust is the foundation of any strong relationship.

[Sarah]: Thank you, Dr. Alan Grant, for those insightful words. It’s clear that while the gap exists, love and understanding are strong enough to cross it. Join us next week as we discuss "Digital Citizenship." Goodbye!`
  },
  tasks: [
    {
      task_id: "u1_l_t1",
      type: 'true_false',
      instruction: "Task 1: Listen and decide if the statements are True or False.",
      questions: [
        { id: 1, question: "The generation gap is caused solely by the difference in age.", answer: false, explanation: "Dr. Alan explains it is about differences in attitudes, values, and the environment they grew up in, not just age." },
        { id: 2, question: "Urbanization has contributed to the rise of nuclear families.", answer: true, explanation: "He mentions that urbanization has led to the rise of nuclear families, moving away from extended ones." },
        { id: 3, question: "Parents usually accept modern career choices like being a YouTuber easily.", answer: false, explanation: "He states parents might interpret such choices as being 'lazy' or unrealistic." },
        { id: 4, question: "The digital divide is a major source of conflict between generations.", answer: true, explanation: "He explicitly names the 'digital divide' as the third major wedge." }
      ]
    },
    {
      task_id: "u1_l_t2",
      type: 'fill_in_blanks',
      instruction: "Task 2: Fill in the gaps with words from the audio.",
      questions: [
        { id: 5, sentence: "The gap refers to differences in attitudes, values, and ______.", answer: "behaviors", explanation: "Dr. Alan lists: attitudes, values, behaviors, and tastes.", hint: "b_ _ _ _ _ _ _ _" },
        { id: 6, sentence: "Teens often want to ______ their own identity.", answer: "establish", explanation: "He says teens are in a phase where they need to establish their own identity.", hint: "e_ _ _ _ _ _ _ _" },
        { id: 7, sentence: "Parents might enforce a strict ______ for safety.", answer: "curfew", explanation: "He gives the example of parents enforcing a strict curfew.", hint: "c_ _ _ _ _" },
        { id: 8, sentence: "A simple compromise can create a shared space for ______.", answer: "connection", explanation: "He suggests a 'no phones' rule to create space for connection.", hint: "c_ _ _ _ _ _ _ _ _" }
      ]
    },
    {
      task_id: "u1_l_t3",
      type: 'multiple_choice',
      instruction: "Task 3: Choose the best option.",
      questions: [
        { id: 9, question: "What is the 'primary tool' mentioned to bridge the gap?", options: ["Technology", "Money", "Communication", "Education"], answer: "Communication", explanation: "Sarah and Dr. Alan agree that communication is the most vital tool." },
        { id: 10, question: "According to Dr. Alan, trust is the foundation of what?", options: ["Society", "Any strong relationship", "Financial success", "School performance"], answer: "Any strong relationship", explanation: "His final advice states trust is the foundation of any strong relationship." }
      ]
    }
  ]
};

export const UNIT2_LISTENING_DATA: ListeningData = {
  module_id: "u2_listening",
  title: "Listening: Vietnam and ASEAN",
  unit_context: "Unit 2: Vietnam and ASEAN",
  audio_source: "", 
  transcript: {
    title: "Vietnam in ASEAN: A Journey of Integration",
    speakers: ["Narrator"],
    content: `The Association of Southeast Asian Nations, or ASEAN, was established on August 8, 1967, in Bangkok, Thailand. Initially, it had five founding members: Indonesia, Malaysia, Philippines, Singapore, and Thailand. Vietnam officially became the seventh member of ASEAN on July 28, 1995. This was a historic milestone, marking the beginning of Vietnam's deep integration into the region and the world.

One of the most important documents for the organization is the ASEAN Charter. Adopted in 2007, it serves as a legal framework, setting out the rules, values that all members must follow. It emphasizes respect for independence, sovereignty, equality, territorial integrity, and peaceful dispute resolution.

The motto of ASEAN is 'One Vision, One Identity, One Community.' This reflects the goal of creating a united region where countries help each other grow. For Vietnam, joining ASEAN has brought many economic benefits. It opened doors for trade, allowing Vietnamese goods to reach millions of consumers across Southeast Asia. The ASEAN Economic Community (AEC) aims to create a single market and production base, allowing for the free flow of goods, services, and skilled labor.

However, it's not just about money. Cultural exchange is equally vital. Programs like the Southeast Asian Games (SEA Games) and youth festivals help citizens understand each other's traditions. Scholarships and exchange programs allow students to study in neighboring countries, fostering a sense of regional citizenship.

Looking ahead, Vietnam continues to play an active and responsible role. By promoting stability and solidarity, Vietnam ensures that ASEAN remains a peaceful and prosperous home for all its citizens. The country has successfully hosted several ASEAN Summits, proposing initiatives to narrow the development gap and address global challenges like climate change and pandemics.`
  },
  tasks: [
    {
      task_id: "u2_l_t1",
      type: 'true_false',
      instruction: "Task 1: Listen and decide if the statements are True or False.",
      questions: [
        { id: 1, question: "Vietnam was one of the five founding members of ASEAN.", answer: false, explanation: "The text states Vietnam became the seventh member in 1995, not a founding member." },
        { id: 2, question: "The ASEAN Charter is a legal framework for member countries.", answer: true, explanation: "The text explicitly calls the Charter a 'legal framework'." },
        { id: 3, question: "The ASEAN Economic Community restricts the flow of goods.", answer: false, explanation: "The text says it aims for the 'free flow of goods', not restricting it." },
        { id: 4, question: "Vietnam has successfully hosted ASEAN Summits.", answer: true, explanation: "Mentioned in the final paragraph." }
      ]
    },
    {
      task_id: "u2_l_t2",
      type: 'fill_in_blanks',
      instruction: "Task 2: Fill in the gaps with words from the audio.",
      questions: [
        { id: 5, sentence: "Vietnam officially became the ______ member of ASEAN in 1995.", answer: "seventh", explanation: "From the first paragraph.", hint: "s_ _ _ _ _ _" },
        { id: 6, sentence: "The motto of ASEAN is 'One Vision, One ______, One Community.'", answer: "Identity", explanation: "From the third paragraph.", hint: "I_ _ _ _ _ _ _" },
        { id: 7, sentence: "Joining ASEAN opened doors for ______ and economic growth.", answer: "trade", explanation: "It opened doors for trade.", hint: "t_ _ _ _" },
        { id: 8, sentence: "Vietnam promotes stability and ______ in the region.", answer: "solidarity", explanation: "Mentioned in the conclusion.", hint: "s_ _ _ _ _ _ _ _ _" }
      ]
    },
    {
      task_id: "u2_l_t3",
      type: 'multiple_choice',
      instruction: "Task 3: Choose the best option.",
      questions: [
        { id: 9, question: "When was the ASEAN Charter adopted?", options: ["1967", "1995", "2007", "2020"], answer: "2007", explanation: "The text states the Charter was adopted in 2007." },
        { id: 10, question: "What is mentioned as a benefit for students?", options: ["Free housing", "Scholarships", "New cars", "Online games"], answer: "Scholarships", explanation: "Scholarships and exchange programs are mentioned." }
      ]
    }
  ]
};

export const UNIT3_LISTENING_DATA: ListeningData = {
  module_id: "u3_listening",
  title: "Listening: Global Warming",
  unit_context: "Unit 3: Global Warming",
  audio_source: "", // Ensures music files are overwritten by AI generation
  transcript: {
    title: "Our Warming Planet: Causes and Solutions",
    speakers: ["Dr. Green (Environmentalist)"],
    content: `Hello students. Today we are discussing the most urgent issue of our time: Global Warming.

First, we must understand the 'Greenhouse Effect'. Naturally, gases like carbon dioxide trap heat from the sun to keep the Earth warm enough for life. However, human activities are releasing too much of these gases into the atmosphere, causing the planet to heat up too quickly.

Burning fossil fuels like coal, oil, and gas for electricity, transportation, and industry is the biggest problem. This releases massive amounts of CO2. Another major cause is deforestation. Trees act as the Earth's lungs, absorbing CO2. When we cut them down for timber or farmland, that gas stays in the atmosphere and contributes to warming.

We also cannot ignore methane, a very powerful greenhouse gas. It is produced in large quantities by large-scale livestock farming—cows and sheep—and by waste decomposing in landfills.

The consequences are frightening. Polar ice caps are melting at an alarming rate, causing sea levels to rise. This threatens coastal cities and river deltas, particularly in Vietnam. Extreme weather events, like stronger typhoons, heatwaves, and droughts, are becoming more frequent and severe, disrupting agriculture and ecosystems.

But there is hope. We can switch to renewable energy sources like solar and wind power, which are clean and infinite. We can reduce our carbon footprint by using public transport, saving electricity, and eating less meat. Planting more trees is also a powerful solution. Every small action counts in the fight to save our planet.`
  },
  tasks: [
    {
      task_id: "u3_l_t1",
      type: 'true_false',
      instruction: "Task 1: Listen and decide if the statements are True or False.",
      questions: [
        { id: 1, question: "The greenhouse effect is entirely bad for the Earth.", answer: false, explanation: "Dr. Green says it naturally keeps Earth warm enough for life; only 'too much' is bad." },
        { id: 2, question: "Deforestation contributes to global warming.", answer: true, explanation: "Trees absorb CO2, so cutting them down leaves more gas in the air." },
        { id: 3, question: "Methane is less powerful than carbon dioxide.", answer: false, explanation: "The text describes methane as 'a very powerful greenhouse gas'." },
        { id: 4, question: "Vietnam is safe from rising sea levels.", answer: false, explanation: "It threatens coastal cities and river deltas, particularly in Vietnam." }
      ]
    },
    {
      task_id: "u3_l_t2",
      type: 'fill_in_blanks',
      instruction: "Task 2: Fill in the gaps with words from the audio.",
      questions: [
        { id: 5, sentence: "Burning ______ fuels is the biggest problem.", answer: "fossil", explanation: "Fossil fuels like coal, oil, and gas.", hint: "f_ _ _ _ _" },
        { id: 6, sentence: "Trees act as the Earth's ______.", answer: "lungs", explanation: "Metaphor used in the second paragraph.", hint: "l_ _ _ _" },
        { id: 7, sentence: "Methane is produced by ______ farming.", answer: "livestock", explanation: "Cows and sheep farming.", hint: "l_ _ _ _ _ _ _ _" },
        { id: 8, sentence: "We should switch to ______ energy sources.", answer: "renewable", explanation: "Solar and wind are renewable.", hint: "r_ _ _ _ _ _ _ _" }
      ]
    },
    {
      task_id: "u3_l_t3",
      type: 'multiple_choice',
      instruction: "Task 3: Choose the best option.",
      questions: [
        { id: 9, question: "What happens when polar ice caps melt?", options: ["Sea levels drop", "Sea levels rise", "It snows more", "Nothing happens"], answer: "Sea levels rise", explanation: "Melting ice adds water to the oceans." },
        { id: 10, question: "What is NOT mentioned as a solution?", options: ["Planting trees", "Using solar power", "Building more factories", "Using public transport"], answer: "Building more factories", explanation: "Factories typically increase emissions." }
      ]
    }
  ]
};

export const UNIT4_LISTENING_DATA: ListeningData = {
  module_id: "u4_listening",
  title: "Listening: World Heritage",
  unit_context: "Unit 4: World Heritage",
  audio_source: "",
  transcript: {
    title: "Preserving Our Heritage: The Treasures of Vietnam",
    speakers: ["Tour Guide"],
    content: `Welcome everyone to our tour of Vietnam's World Heritage Sites. UNESCO has recognized many sites in our beautiful country, acknowledging their outstanding universal value to humanity.

We have spectacular natural wonders like Ha Long Bay, famous for its thousands of limestone islands and emerald waters. We also have rich cultural treasures like the Complex of Hue Monuments, the My Son Sanctuary, and Hoi An Ancient Town. These places tell the story of our history, architecture, and traditions.

However, being a heritage site comes with significant challenges. Mass tourism is a double-edged sword. While it brings money for restoration and local development, too many visitors can damage the ancient structures and pollute the natural environment. Foot traffic wears down stone steps, and litter can ruin the landscape.

Climate change is another serious threat. Rising sea levels and harsh weather can erode old walls and flood historic towns like Hoi An. Termites and humidity also constantly attack wooden structures.

So, what can we do? Preservation is key. We must follow strict rules to keep these sites authentic. As visitors, we should respect the regulations—don't litter, don't touch fragile artifacts, and try to learn about the history. Governments and organizations are working on restoration projects to repair damage without changing the original style.

These sites don't just belong to us; they belong to future generations. It is our duty to safeguard them so that our children can also appreciate the beauty of the past.`
  },
  tasks: [
    {
      task_id: "u4_l_t1",
      type: 'true_false',
      instruction: "Task 1: Listen and decide if the statements are True or False.",
      questions: [
        { id: 1, question: "UNESCO sites only have value to the local people.", answer: false, explanation: "They have 'outstanding universal value to humanity'." },
        { id: 2, question: "Ha Long Bay is mentioned as a cultural treasure.", answer: false, explanation: "It is described as a 'natural wonder'." },
        { id: 3, question: "Mass tourism can cause damage to ancient structures.", answer: true, explanation: "The guide calls it a double-edged sword that can damage structures." },
        { id: 4, question: "Climate change is not a threat to heritage sites.", answer: false, explanation: "It is listed as a 'serious threat'." }
      ]
    },
    {
      task_id: "u4_l_t2",
      type: 'fill_in_blanks',
      instruction: "Task 2: Fill in the gaps with words from the audio.",
      questions: [
        { id: 5, sentence: "Hoi An Ancient Town is a ______ treasure.", answer: "cultural", explanation: "Listed under cultural treasures.", hint: "c_ _ _ _ _ _ _" },
        { id: 6, sentence: "Tourism brings money for ______.", answer: "restoration", explanation: "Money for fixing the sites.", hint: "r_ _ _ _ _ _ _ _ _ _" },
        { id: 7, sentence: "We must follow rules to keep sites ______.", answer: "authentic", explanation: "Keep them original/authentic.", hint: "a_ _ _ _ _ _ _ _" },
        { id: 8, sentence: "It is our duty to ______ these sites.", answer: "safeguard", explanation: "Final sentence mentions safeguarding.", hint: "s_ _ _ _ _ _ _ _" }
      ]
    },
    {
      task_id: "u4_l_t3",
      type: 'multiple_choice',
      instruction: "Task 3: Choose the best option.",
      questions: [
        { id: 9, question: "What attacks wooden structures?", options: ["Tourists", "Termites and humidity", "Birds", "Fish"], answer: "Termites and humidity", explanation: "Mentioned as a threat to wood." },
        { id: 10, question: "Who do these sites belong to?", options: ["Only the government", "Future generations", "Tour guides", "UNESCO only"], answer: "Future generations", explanation: "They belong to future generations." }
      ]
    }
  ]
};

export const UNIT5_LISTENING_DATA: ListeningData = { module_id: "u5_listening", title: "Listening: Education", unit_context: "Unit 5", audio_source: "", transcript: { title: "Future Classrooms", speakers: [], content: "" }, tasks: [] };
export const UNIT6_LISTENING_DATA: ListeningData = { module_id: "u6_listening", title: "Listening: Social Issues", unit_context: "Unit 6", audio_source: "", transcript: { title: "Community Problems", speakers: [], content: "" }, tasks: [] };
export const UNIT7_LISTENING_DATA: ListeningData = { module_id: "u7_listening", title: "Listening: Healthy Lifestyle", unit_context: "Unit 7", audio_source: "", transcript: { title: "Wellness", speakers: [], content: "" }, tasks: [] };
export const UNIT8_LISTENING_DATA: ListeningData = { module_id: "u8_listening", title: "Listening: Life Expectancy", unit_context: "Unit 8", audio_source: "", transcript: { title: "Living Longer", speakers: [], content: "" }, tasks: [] };

// Added export to resolve cascading error in App.tsx
export const COURSE_DATA: UnitData[] = [
  {
    id: 'u1',
    title: 'Unit 1: Generation Gap',
    vocab: UNIT1_VOCAB,
    grammar: {
      topic: 'Present Tenses and Stative Verbs',
      questions: UNIT1_GRAMMAR_CHALLENGE.questions.map(q => ({ id: q.id, question: q.question, options: q.options || [], correctIndex: q.options ? q.options.indexOf(q.answer || '') : 0, explanation: q.explanation })),
      games: []
    },
    speaking: {
      drills: [{ text: "I have a conflict with my parents." }, { text: "My parents are very strict with me." }],
      interview: [{ question: "Do you ever have arguments with your parents?" }]
    },
    writing: {
      topic: 'Generation Gap',
      prompt: 'Write an essay about the causes of the generation gap.',
      preWriting: unit1PreWriting,
      scaffolding: {
        structure: [
          "Mở bài: Dẫn dắt về vấn đề khoảng cách thế hệ trong gia đình hiện nay.",
          "Thân bài 1: Nêu các nguyên nhân gây ra mâu thuẫn (khác biệt về quan điểm, lối sống).",
          "Thân bài 2: Đề xuất giải pháp (lắng nghe, chia sẻ, tôn trọng sự độc lập).",
          "Kết bài: Khẳng định tầm quan trọng của việc thấu hiểu để thu hẹp khoảng cách."
        ],
        phrases: [
          "generation gap (n): khoảng cách thế hệ",
          "independent (adj) / independence (n): tự lập / sự độc lập",
          "strict (adj): nghiêm khắc",
          "old-fashioned (adj): lạc hậu, lỗi thời",
          "easy-going (adj): dễ tính",
          "relationship (n): mối quan hệ"
        ]
      },
      sampleEssay: {
        title: "SAMPLE ESSAY: THE GENERATION GAP",
        content: "In many families, the generation gap is a common issue that causes conflicts between parents and children. There are several causes for this gap, primarily differences in viewpoints and lifestyles. Parents often value traditional manners and stability, while teenagers strive for independence and modern trends. To bridge this gap, both sides need to listen and share. Parents should respect their children's privacy and opinions, while children should understand their parents' concerns. In conclusion, mutual understanding is the key to a happy family."
      }
    },
    reading: UNIT1_READING_DATA,
    listening: UNIT1_LISTENING_DATA
  },
  {
    id: 'u2',
    title: 'Unit 2: Vietnam and ASEAN',
    vocab: UNIT2_VOCAB,
    grammar: {
      topic: 'Past Tenses and Cleft Sentences',
      questions: UNIT2_GRAMMAR_CHALLENGE.questions.map(q => ({ id: q.id, question: q.question, options: q.options || [], correctIndex: q.options ? q.options.indexOf(q.answer || '') : 0, explanation: q.explanation })),
      games: []
    },
    speaking: {
      drills: [{ text: "Vietnam is a member of ASEAN." }],
      interview: [{ question: "What historical sites in Vietnam do you like?" }]
    },
    writing: {
      topic: 'Vietnam and ASEAN',
      prompt: 'Write about the benefits of ASEAN membership.',
      preWriting: unit2PreWriting,
      sampleEssay: {
        title: "SAMPLE ESSAY: VIETNAM AND ASEAN",
        content: "Since joining ASEAN in 1995, Vietnam has experienced significant economic and cultural growth. Membership has opened doors for trade, investment, and cultural exchange with neighboring countries. Furthermore, regional cooperation helps maintain peace and stability, allowing Vietnam to focus on development. In conclusion, ASEAN membership is vital for Vietnam's future prosperity and integration."
      }
    },
    reading: UNIT2_READING_DATA,
    listening: UNIT2_LISTENING_DATA
  },
  {
    id: 'u3',
    title: 'Unit 3: Global Warming',
    vocab: UNIT3_VOCAB,
    grammar: {
      topic: 'Present Perfect and Past Simple',
      questions: UNIT3_GRAMMAR_CHALLENGE.questions.map(q => ({ id: q.id, question: q.question, options: q.options || [], correctIndex: q.options ? q.options.indexOf(q.answer || '') : 0, explanation: q.explanation })),
      games: []
    },
    speaking: {
      drills: [{ text: "Global warming is a serious threat." }],
      interview: [{ question: "What causes global warming?" }]
    },
    writing: {
      topic: 'Global Warming',
      prompt: 'Write about ways to reduce your carbon footprint.',
      preWriting: unit3PreWriting,
      sampleEssay: {
        title: "SAMPLE ESSAY: COMBATING GLOBAL WARMING",
        content: "Global warming is an alarming issue caused mainly by human activities. To combat this, individuals must take responsibility for reducing their carbon footprint. Simple actions like using public transport, planting trees, and recycling can make a significant difference. By working together to protect the environment, we can ensure a safer planet for future generations."
      }
    },
    reading: UNIT3_READING_DATA,
    listening: UNIT3_LISTENING_DATA
  },
  {
    id: 'u4',
    title: 'Unit 4: World Heritage',
    vocab: UNIT4_VOCAB,
    grammar: {
      topic: 'Paired Conjunctions and Compound Nouns',
      questions: UNIT4_GRAMMAR_CHALLENGE.questions.map(q => ({ id: q.id, question: q.question, options: q.options || [], correctIndex: q.options ? q.options.indexOf(q.answer || '') : 0, explanation: q.explanation })),
      games: []
    },
    speaking: {
      drills: [{ text: "Ha Long Bay is a world heritage site." }],
      interview: [{ question: "Which heritage site do you like the most?" }]
    },
    writing: {
      topic: 'World Heritage',
      prompt: 'Write about the importance of preserving heritage.',
      preWriting: unit4PreWriting,
      sampleEssay: {
        title: "SAMPLE ESSAY: PRESERVING OUR HERITAGE",
        content: "Preserving World Heritage Sites is crucial for maintaining our cultural identity and history. These sites not only attract tourism but also educate future generations about our past. However, they face threats from pollution and neglect. Therefore, both the government and individuals must take action to protect and restore these invaluable treasures."
      }
    },
    reading: UNIT4_READING_DATA,
    listening: UNIT4_LISTENING_DATA
  },
  {
    id: 'u5',
    title: 'Unit 5: Cities and Education in the Future',
    vocab: UNIT5_VOCAB,
    grammar: {
      topic: 'Future Forms',
      questions: [],
      games: []
    },
    speaking: { drills: [], interview: [] },
    writing: {
      topic: 'Future Cities',
      prompt: 'Describe a city in the future.',
      preWriting: [],
      sampleEssay: { title: "Sample", content: "Content pending." }
    },
    reading: UNIT5_READING_DATA,
    listening: UNIT5_LISTENING_DATA
  },
  {
    id: 'u6',
    title: 'Unit 6: Social Issues',
    vocab: UNIT6_VOCAB,
    grammar: {
      topic: 'Linking Words',
      questions: [],
      games: []
    },
    speaking: { drills: [], interview: [] },
    writing: {
      topic: 'Social Issues',
      prompt: 'Discuss a social issue in your community.',
      preWriting: [],
      sampleEssay: { title: "Sample", content: "Content pending." }
    },
    reading: UNIT6_READING_DATA,
    listening: UNIT6_LISTENING_DATA
  },
  {
    id: 'u7',
    title: 'Unit 7: Healthy Lifestyle',
    vocab: UNIT7_VOCAB,
    grammar: {
      topic: 'Modals',
      questions: [],
      games: []
    },
    speaking: { drills: [], interview: [] },
    writing: {
      topic: 'Healthy Lifestyle',
      prompt: 'Write about how to stay healthy.',
      preWriting: [],
      sampleEssay: { title: "Sample", content: "Content pending." }
    },
    reading: UNIT7_READING_DATA,
    listening: UNIT7_LISTENING_DATA
  },
  {
    id: 'u8',
    title: 'Unit 8: Health and Life Expectancy',
    vocab: UNIT8_VOCAB,
    grammar: {
      topic: 'Reported Speech',
      questions: [],
      games: []
    },
    speaking: { drills: [], interview: [] },
    writing: {
      topic: 'Life Expectancy',
      prompt: 'Write about factors affecting life expectancy.',
      preWriting: [],
      sampleEssay: { title: "Sample", content: "Content pending." }
    },
    reading: UNIT8_READING_DATA,
    listening: UNIT8_LISTENING_DATA
  }
];

// Added export to resolve cascading error in Unit1ClozeGame.tsx
export const unit1GameData: ClozeQuestion[] = [
  { id: 1, sentence: "The _______ refers to the differences in opinions and behaviors between generations.", options: ["generation gap", "nuclear family", "extended family", "curfew"], correctAnswer: "generation gap", explanation: "Generation gap is the standard term for these differences.", illustrationUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800" },
  { id: 2, sentence: "Most young people in big cities live in a _______ family.", options: ["nuclear", "extended", "joint", "large"], correctAnswer: "nuclear", explanation: "Nuclear families (parents and children) are common in urban areas.", illustrationUrl: "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?q=80&w=800" },
  { id: 3, sentence: "I have to be home before my 10 p.m. _______.", options: ["deadline", "limit", "curfew", "schedule"], correctAnswer: "curfew", explanation: "A curfew is a set time to be home.", illustrationUrl: "https://images.unsplash.com/photo-1508962914676-139425cf8312?q=80&w=800" },
  { id: 4, sentence: "Arguments about chores can lead to _______ between parents and teens.", options: ["peace", "conflict", "harmony", "agreement"], correctAnswer: "conflict", explanation: "Conflict refers to serious disagreements.", illustrationUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800" },
  { id: 5, sentence: "Living in an _______ family helps children bond with their grandparents.", options: ["nuclear", "extended", "small", "modern"], correctAnswer: "extended", explanation: "Extended families include grandparents and other relatives.", illustrationUrl: "https://images.unsplash.com/photo-1520850838445-53c48524036e?q=80&w=800" }
];
