/**
 * Hybrid Encryption Provider (RSA + AES-256)
 * 
 * 국가 공인 ISMS-P 심사 기준을 충족하는 하이브리드 암복호화 프로세스 예시입니다.
 * 대칭키(AES)로 데이터를 암호화하고, 해당 대칭키를 비대칭키(RSA)로 보호하는 방식입니다.
 */
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class HybridEncryptionProvider {

    private static final String AES_ALGO = "AES/CBC/PKCS5Padding";
    private static final String RSA_ALGO = "RSA/ECB/PKCS1Padding";

    /**
     * 하이브리드 암호화 수행
     */
    public String encryptHybrid(String plainText, String rsaPublicKeyBase64) throws Exception {
        // 1. AES 대칭키 생성
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(256);
        SecretKey aesKey = keyGen.generateKey();

        // 2. AES로 본문 암호화
        Cipher aesCipher = Cipher.getInstance(AES_ALGO);
        aesCipher.init(Cipher.ENCRYPT_MODE, aesKey);
        byte[] encryptedData = aesCipher.doFinal(plainText.getBytes());

        // 3. RSA로 AES 키 암호화
        PublicKey rsaPublicKey = loadPublicKey(rsaPublicKeyBase64);
        Cipher rsaCipher = Cipher.getInstance(RSA_ALGO);
        rsaCipher.init(Cipher.ENCRYPT_MODE, rsaPublicKey);
        byte[] encryptedAesKey = rsaCipher.doFinal(aesKey.getEncoded());

        // 4. 결과 조합 (Base64 조합 등 실무 프로토콜에 맞게 구성)
        return Base64.getEncoder().encodeToString(encryptedAesKey) + ":" + 
               Base64.getEncoder().encodeToString(encryptedData);
    }

    private PublicKey loadPublicKey(String base64Key) throws Exception {
        byte[] decoded = Base64.getDecoder().decode(base64Key);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(decoded);
        return KeyFactory.getInstance("RSA").generatePublic(spec);
    }
}
