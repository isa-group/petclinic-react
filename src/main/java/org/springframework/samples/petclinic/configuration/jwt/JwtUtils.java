package org.springframework.samples.petclinic.configuration.jwt;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import javax.security.auth.message.AuthException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.samples.petclinic.configuration.services.UserDetailsImpl;
import org.springframework.samples.petclinic.user.Authorities;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

import org.springframework.samples.petclinic.user.UserService;
import org.springframework.samples.petclinic.plan.Plan;
import org.springframework.samples.petclinic.plan.ParserPlan;
import org.springframework.samples.petclinic.plan.PlanService;

import es.us.isagroup.FeatureTogglingUtil;

@Component
public class JwtUtils {
	private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

	@Value("${petclinic.app.jwtSecret}")
	private String jwtSecret;

	@Value("${petclinic.app.jwtExpirationMs}")
	private int jwtExpirationMs;

	@Autowired
	private UserService userService;

	@Autowired
	private PlanService planService;

	public String generateJwtToken(Authentication authentication) {

		UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
		Map<String, Object> claims = new HashMap<>();
		Object userAuthorities = userPrincipal.getAuthorities().stream().map(auth -> auth.getAuthority()).collect(Collectors.toList());
		String newToken = null;

		try{
			Map<String, Object> userContext = userService.findUserContext();
			Plan userPlan = userService.findUserPlan();
			ParserPlan planParser = planService.findPlanParserById(1);

			FeatureTogglingUtil util = new FeatureTogglingUtil(userPlan.parseToMap(),
						planParser.parseToMap(), userContext, jwtSecret, userAuthorities);
				newToken = util.generateUserToken();
		}catch(AuthException e){
			logger.error("Error getting features: {}", e.getMessage());
		}

		return newToken;
	}

	public String generateTokenFromUsername(String username, Authorities authority) {
		Map<String, Object> claims = new HashMap<>();
		claims.put("authorities", authority.getAuthority());
		return Jwts.builder().setClaims(claims).setSubject(username).setIssuedAt(new Date())
				.setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
				.signWith(SignatureAlgorithm.HS512, jwtSecret).compact();
	}

	public String getUserNameFromJwtToken(String token) {
		return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
	}

	public String getFeaturesFromJwtToken(String token) {
		return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().get("features").toString();
	}

	public boolean validateJwtToken(String authToken) {
		try {
			Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
			return true;
		} catch (SignatureException e) {
			logger.error("Invalid JWT signature: {}", e.getMessage());
		} catch (MalformedJwtException e) {
			logger.error("Invalid JWT token: {}", e.getMessage());
		} catch (ExpiredJwtException e) {
			logger.error("JWT token is expired: {}", e.getMessage());
		} catch (UnsupportedJwtException e) {
			logger.error("JWT token is unsupported: {}", e.getMessage());
		} catch (IllegalArgumentException e) {
			logger.error("JWT claims string is empty: {}", e.getMessage());
		}

		return false;
	}
}
